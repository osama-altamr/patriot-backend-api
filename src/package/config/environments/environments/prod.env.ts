import * as process from 'node:process';
import { IDatabaseEnv } from '../interfaces/database.inteface';
import { IAppEnv } from '../interfaces/app.interface';
import { IBaseEnv } from '../interfaces/base.interface';

interface IAppPordEnv extends IAppEnv{
}

interface IDatabasePordEnv extends IDatabaseEnv {
  password: string;
  user: string;
}

export interface IPordEnv extends IBaseEnv {
  app: IAppPordEnv,
  database: IDatabasePordEnv;
}

export const GetProdEnv = ():IPordEnv=><IPordEnv>({
  app: {
    host: process.env.HOST,
    name: process.env.NAME,
    port: +process.env.PORT
  },
  database: {
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER
  }
})


