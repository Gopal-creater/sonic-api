import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { EC2InstanceMetadata } from 'src/constants/Enums';
import { enumToArrayOfObject } from '../utils';
@Injectable()
export class Ec2InstanceService {
  getInstanceMetaData() {
    return axios.get('http://169.254.169.254/latest/meta-data/').then(res => {
      return res.data;
    });
  }

  getInstanceDetailsForMetaData(metadata: string) {
    return axios
      .get(`http://169.254.169.254/latest/meta-data/${metadata}`)
      .then(res => {
        return res.data;
      });
  }

  async getInstanceDetails() {
    const metadataArr = enumToArrayOfObject<EC2InstanceMetadata>(
      EC2InstanceMetadata,
    );
    const promises = metadataArr.map(
      ({ key, value }: { key: string; value: string }) => {
        return this.getInstanceDetailsForMetaData(value)
          .then(data => {
            var obj = {};
            obj[key] = data;
            return obj;
          })
          .catch(err => {
            var obj = {};
            obj[key] = null;
            return obj;
          });
      },
    );
    return Promise.all(promises).then(values => {
      return Object.assign({}, ...values);
    });
  }
}
