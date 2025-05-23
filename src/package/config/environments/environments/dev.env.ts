import * as process from 'node:process';
import { IDatabaseEnv } from '../interfaces/database.inteface';
import { IAppEnv } from '../interfaces/app.interface';
import { IBaseEnv } from '../interfaces/base.interface';
import { IJWTEnv } from '../../../config/environments/interfaces/jwt.interface';
import { IMailerSendEnv } from '../interfaces/mailersend.interface';

export interface IAppDevEnv extends IAppEnv {}

export interface IDatabaseDevEnv extends IDatabaseEnv {
  password: string;
  username: string;
  name: string;
}

export interface IJWTDevEnv extends IJWTEnv {}

export interface IDevEnv extends IBaseEnv {
  app: IAppDevEnv;
  database: IDatabaseDevEnv;
  jwt: IJWTDevEnv;
  mailerSend: IMailerSendEnv
}

export const GetDevEnv = (): IDevEnv => ({
  app: {
    host: process.env.HOST,
    name: process.env.NAME,
    port: +process.env.PORT,
  },
  database: {
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    username: process.env.DB_USERNAME,
    name: process.env.DB_NAME,
  },
  jwt: {
    jwtAccessToken: process.env.JWT_ACCESS_SECRET,
    jwtRefreshToken: process.env.JWT_REFRESH_SECRET,
    jwtExpiredRefresh: process.env.JWT_EXPIRED_REFRESH,
    jwtExpiredAccess: process.env.JWT_EXPIRED_ACCESS,
  },
  mailerSend: {
    apiKey: process.env.MAILERSEND_API_KEY,
    name: process.env.MAILERSEND_SENDER_NAME,
    senderEmail: process.env.MAILERSEND_SENDER_EMAIL,
  },
  aws: {
    region: process.env.AWS_REGION,
    accessKey: process.env.AWS_ACCESS_KEY,
    secretKey: process.env.AWS_SECRET_KEY,
    bucketName: process.env.AWS_BUCKET_NAME,
  }
});
