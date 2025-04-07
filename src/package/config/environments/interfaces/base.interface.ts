import { IAppEnv } from './app.interface';
import { IDatabaseEnv } from './database.inteface';
import { IJWTEnv } from '../../../config/environments/interfaces/jwt.interface';

export interface IBaseEnv {
  app: IAppEnv,
  database: IDatabaseEnv
  jwt: IJWTEnv
}