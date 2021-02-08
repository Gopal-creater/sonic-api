import {
  CreateLicenceI,
  UpdateLicenceI,
} from './interfaces';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';

@Injectable()
export class KeygenService {
  private apiBaseUrl: string;
  private licenceEndPoint: string;
  private credentials: string;
  private adminToken: string;
  constructor(private readonly configService: ConfigService) {
    this.apiBaseUrl = `https://api.keygen.sh/v1/accounts/${this.configService.get(
      'KEYGEN_ACCOUNT_ID',
    )}`;
    this.licenceEndPoint = `${this.apiBaseUrl}/licenses`;
    this.credentials = Buffer.from(
      `${this.configService.get('KEYGEN_USER_EMAIL')}:${this.configService.get(
        'KEYGEN_USER_PASSWORD',
      )}`,
    ).toString('base64');
    this.adminToken = this.configService.get('KEYGEN_ADMIN_TOKEN');
  }

  //Method for generating a new admin token
  async generateToken() {
    return fetch(
        `${this.apiBaseUrl}/tokens`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/vnd.api+json',
          Authorization: `Basic ${this.credentials}`,
        },
      },
    ).then(response => response.json())
    // .then(({data,errors})=>{
    //   if(errors){

    //   }
    // })
  }

  //Method for creating a new license
  async createLicense(license: CreateLicenceI) {
    return fetch(this.licenceEndPoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Accept: 'application/vnd.api+json',
        Authorization: `Bearer ${this.adminToken}`,
      },
      body: JSON.stringify({
        data: {
          type: 'licenses',
          attributes: {
            ...license.attribute,
          },
          relationships: {
            policy: {
              data: {
                type: 'policies',
                id: license.relation.policyId,
              },
            },
            user: {
              data: {
                type: 'users',
                id: license.relation.userId,
              },
            },
          },
        },
      }),
    }).then(response => response.json());
  }

  //Method to list all the licenses
  // See this for query options https://keygen.sh/docs/api/#licenses-list
  async getAllLicenses(query?: string) {
    return fetch(
        `${this.licenceEndPoint}?${query}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/vnd.api+json',
          Authorization: `Bearer ${this.adminToken}`,
        },
      },
    ).then(response => response.json());
    
  }

  //Method for getting a license by id
  async getLicenseById(id: string) {
    return fetch(
        `${this.licenceEndPoint}/${id}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/vnd.api+json',
          Authorization: `Bearer ${this.adminToken}`,
        },
      },
    ).then(response => response.json());
  }


  async validateLicence(id: string) {
    return fetch(
        `${this.licenceEndPoint}/${id}/actions/validate`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/vnd.api+json',
          Authorization: `Bearer ${this.adminToken}`,
        },
      },
    ).then(response => response.json());
  }
//   async validateLicence(id: string) {

//     var usage = await this.getLicenseById(id);

//     usage = usage['data']['attributes']['uses'];
//     console.log('usage-->',usage);

//     const expiryDate = usage['data']['attributes']['uses'];
//     console.log('expiryDate-->', expiryDate);

//     const response =  await fetch(
//         `${this.licenceEndPoint}/${id}/actions/validate`,
//       {
//         method: 'POST',
//         headers: {
//           Accept: 'application/vnd.api+json',
//           Authorization: `Bearer ${this.adminToken}`,
//         },
//         // body: JSON.stringify({
//         //   data:{
//         //   attributes : {
//         //     expiry: expiryDate,
//         //     uses: usage,
//         //     maxUses: 10,
//         //   }}
//         // })
//       },
//     );
//     const { meta, data, errors } = await response.json();
//     return     { meta, data, errors };
// ;
//   }

  //Method for updating license
  async updateLicense(id: string, license: UpdateLicenceI) {
    return fetch(
        `${this.licenceEndPoint}/${id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/vnd.api+json',
          Accept: 'application/vnd.api+json',
          Authorization: `Bearer ${this.adminToken}`,
        },
        body: JSON.stringify({
          data: {
            type: 'licenses',
            attributes: { ...license },
          },
        }),
      },
    ).then(response => response.json());
  }

  

  //Method to increment the usage of license
  async incrementUsage(id: string, increment: number=1) {
    return fetch(
        `${this.licenceEndPoint}/${id}/actions/increment-usage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/vnd.api+json',
          Accept: 'application/vnd.api+json',
          Authorization: `Bearer ${this.adminToken}`,
        },
        body: JSON.stringify({
          meta: {
            increment: increment,
          },
        }),
      },
    ).then(response => response.json());
  }

  //Method to decrement the usage of license
  async decrementUsage(id: string, decrementBy: number=1) {
    return fetch(
        `${this.licenceEndPoint}/${id}/actions/decrement-usage`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/vnd.api+json',
          Authorization: `Bearer ${this.adminToken}`,
        },
        body: JSON.stringify({
          meta: {
            decrement: decrementBy,
          },
        }),
      },
    ).then(response => response.json());
  }

  //Method to reset the usage of license
  async resetUsage(id: string) {
    return fetch(
        `${this.licenceEndPoint}/${id}/actions/reset-usage`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/vnd.api+json',
          Authorization: `Bearer ${this.adminToken}`,
        },
      },
    ).then(response => response.json());

  }

  //Method for deleting license
  async deleteLicense(id: string) {
   return fetch(
        `${this.licenceEndPoint}/${id}`,
      {
        method: 'DELETE',
        headers: {
          Accept: 'application/vnd.api+json',
          Authorization: `Bearer ${this.adminToken}`,
        },
      },
    ).then(response => response.json());
  }
}
