import { ApiProperty } from '@nestjs/swagger';
import {
  UserType,
  UserStatusType,
  MFAOptionType,
  AttributeType,
} from 'aws-sdk/clients/cognitoidentityserviceprovider';

export class UserAttributesObj {
  @ApiProperty()
  sub?: string;

  @ApiProperty()
  'cognito:groups'?: string[];

  @ApiProperty()
  email_verified?: boolean;

  @ApiProperty()
  phone_number_verified?: boolean;

  @ApiProperty()
  phone_number?: string;

  @ApiProperty()
  email?: string;
}

export class UserSession {
  sub: string;
  'cognito:groups': string[];
  email_verified: boolean;
  'cognito:preferred_role': string;
  iss: string;
  phone_number_verified: boolean;
  'cognito:username': string;
  'cognito:roles': string[];
  aud: string;
  event_id: string;
  token_use: string;
  auth_time: number;
  phone_number: string;
  exp: number;
  iat: number;
  email: string;
}
