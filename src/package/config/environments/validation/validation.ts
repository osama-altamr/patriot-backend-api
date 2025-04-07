import { getCurrentEnv } from '@Package/config';
import { EnumEnvironment } from '../interfaces/env.enum';
import { devValidationSchema } from './dev.validation';

const validationSchemaEvn = ()=>{
  const env = getCurrentEnv()
  switch(env){
    case EnumEnvironment.DEV :
      return devValidationSchema
    default:
      return devValidationSchema
  }
}