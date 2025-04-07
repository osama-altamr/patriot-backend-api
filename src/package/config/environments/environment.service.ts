import { EnumEnvironment } from './interfaces/env.enum';
import { IBaseEnv } from './interfaces/base.interface';
import { GetDevEnv, IDevEnv } from './environments/dev.env';
import { GetProdEnv } from './environments/prod.env';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as process from 'node:process';

export const getCurrentEnv = ():EnumEnvironment=>{
  const env = process.env.NODE_ENV
  if(!Object.values<string>(EnumEnvironment).includes(env)){
    throw new Error("environment must be in ['development','production','local','test']")
  }
  return env as EnumEnvironment
}

export const loadEnv = ():IBaseEnv=>{
  const env = getCurrentEnv();
  switch(env){
    case EnumEnvironment.DEV:
      return GetDevEnv()
    case EnumEnvironment.PRODUCTION:
      return GetProdEnv()
    default:
      throw new Error(`Unknown environment environment: ${env}`);
  }
}

export type Leaves<T> = T extends object
  ? {
    [K in keyof T]: `${Exclude<K, symbol>}${Leaves<T[K]> extends never
      ? ''
      : `.${Leaves<T[K]>}`}`;
  }[keyof T]
  : never;

export type LeafTypes<T, S extends string> = S extends `${infer T1}.${infer T2}`
  ? T1 extends keyof T
    ? LeafTypes<T[T1], T2>
    : never
  : S extends keyof T
    ? T[S]
    : never;

@Injectable()
export class EnvironmentService {
  constructor(private configService: ConfigService) {
  }
  public get<T extends Leaves<IDevEnv>>(path: T): LeafTypes<IDevEnv, T> {
      return this.configService.get(path);
  }
}