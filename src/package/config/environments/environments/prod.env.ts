import * as process from 'node:process';
import { IDatabaseEnv } from '../interfaces/database.inteface';
import { IAppEnv } from '../interfaces/app.interface';
import { IBaseEnv } from '../interfaces/base.interface';
import { IJWTDevEnv } from './dev.env';
import { IMailerSendEnv } from '../interfaces/mailersend.interface';
import { IAWSEnv } from '../interfaces/aws.interface';

interface IAppPordEnv extends IAppEnv{
}

interface IDatabasePordEnv extends IDatabaseEnv {
  password: string;
  user: string;
}

export interface IPordEnv extends IBaseEnv {
  app: IAppPordEnv,
}

export const GetProdEnv = ():IPordEnv=><IPordEnv>({
  app: {
    host: process.env.HOST,
    name: process.env.NAME,
    port: +process.env.PORT,
  },
  database: {
    host: process.env.DATABASE_URL,
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
})


