import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { EC2InstanceMetadata } from 'src/constants/Enums';
import {
  IEc2RunningServerWithInstanceInfo,
  IEc2InstanceInfo,
} from '../interfaces/common.interface';
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

  async getInstanceDetails(): Promise<IEc2InstanceInfo> {
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

  async getCurrentlyRunningServerDetailsWithEc2InstanceInfo(): Promise<
    IEc2RunningServerWithInstanceInfo
  > {
    const ec2InstanceDetails = await this.getInstanceDetails();
    const port = 8000;
    const domain_hostname = 'https://sonicserver.arba-dev.uk';
    return {
      ...ec2InstanceDetails,
      server_running_port_number: port,
      domain_hostname: domain_hostname,
    };
  }
}
