import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule,  } from '@nestjs/typeorm';
import { EnvironmentService } from '@Package/config';
import { StageSubscriber } from './subscribers/stage.subscriber';

const ORMModule = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [EnvironmentService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    url: configService.get('DATABASE_URL'),
    ssl: { rejectUnauthorized: false } ,
    synchronize: configService.get('NODE_ENV') !== 'production',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    logging: configService.get('NODE_ENV') !== 'production',
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    subscribers: [StageSubscriber],
  }),
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
