import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EnvironmentService } from '@Package/config';
import { DataSource } from 'typeorm';
import { User } from './entities';

const ORMModule = TypeOrmModule.forRootAsync({
  inject: [EnvironmentService],
  useFactory: (envService: EnvironmentService)=>{
    const ormConfig: TypeOrmModuleOptions = {
      type: "postgres",
      port: envService.get("database.port"),
      username: envService.get("database.username"),
      host: envService.get("database.host"),
      password: envService.get("database.password"),
      database: envService.get(("database.name")),
      synchronize: true,
      entities: [__dirname + './../**/*.entity{.ts,.js}'],
      logging: process.env.NODE_ENV !== 'production',
      migrations: [__dirname + './migrations/*{.ts,.js}'],

    }
    return ormConfig;
  }
})

@Module({
  imports: [ORMModule],
})
export class DatabaseModule implements OnModuleInit{
  onModuleInit(): any {
    const logger = new Logger('DatabaseModule');
    logger.verbose('Database initialized');
  }
}
