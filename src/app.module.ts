import { Module } from '@nestjs/common';
import { EnvConfigModule } from '@Package/config';
import { DatabaseModule } from './database/database.module';
import { UserModule } from '/users/user.module';

@Module({
  imports: [
    EnvConfigModule,
    DatabaseModule,
    UserModule
  ],
})
export class AppModule {}
