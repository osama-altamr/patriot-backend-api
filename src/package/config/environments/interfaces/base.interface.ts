import { IAppEnv } from './app.interface';
import { IDatabaseEnv } from './database.inteface';
import { IJWTEnv } from '../../../config/environments/interfaces/jwt.interface';
import { IAWSEnv } from './aws.interface';
import { IMailerSendEnv } from './mailersend.interface';

export interface IBaseEnv {
  app: IAppEnv,
  database: IDatabaseEnv
  jwt: IJWTEnv
  aws: IAWSEnv
  mailerSend: IMailerSendEnv
}