import * as joi from 'joi'
import { IAppDevEnv, IDatabaseDevEnv, IDevEnv } from '../environments/dev.env';
import { IMailerSendEnv } from '../interfaces/mailersend.interface';

export const devValidationSchema = joi.object<IDevEnv>({
    app: joi.object<IAppDevEnv>({
      port: joi.number().required(),
      host: joi.string().required(),
      name: joi.string().required()
    }),
    database: joi.object<IDatabaseDevEnv>({
      host: joi.string().required(),
      port: joi.number().required(),
      password: joi.string().required(),
      username: joi.string().required(),
      name: joi.string().required(),
    }),
    mailerSend: joi.object<IMailerSendEnv>({
      apiKey: joi.string().required(),
      senderEmail: joi.string().required(),
      name: joi.string().required(),
    })
  }).required()


