import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { resolve } from 'path';


dotenv.config({
  path: resolve(process.cwd(), 'development.env'), 
});

console.log(process.env.DATABASE_URL)
export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } ,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
  synchronize: false,
})
