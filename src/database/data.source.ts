import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({
  path: resolve(process.cwd(), 'development.env'), 
});

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [resolve(process.cwd(), 'src/database', '**/*.entity{.ts,.js}')],
  migrations: [resolve(process.cwd(), 'src/database', 'migrations/*{.ts,.js}')],
  synchronize: false,
});
