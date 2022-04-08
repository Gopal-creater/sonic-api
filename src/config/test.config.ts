import { registerAs } from '@nestjs/config';
export default registerAs('test', () => ({
    uri: process.env.MONGODB_URI,
    port: process.env.PORT || 5432
  }));