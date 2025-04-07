import { ConfigModule } from '@nestjs/config';
import { devValidationSchema } from './validation/dev.validation';
import { Global, Logger, Module, OnModuleInit } from '@nestjs/common';
import { getCurrentEnv, EnvironmentService, loadEnv } from './environment.service';

export const AppEnvConfig = ConfigModule.forRoot({
  envFilePath: [`${getCurrentEnv()}.env`],
  isGlobal: true,
  load: [() => loadEnv()],
  validationSchema: devValidationSchema,
});

@Global()
@Module({
  imports: [AppEnvConfig],
  providers: [EnvironmentService],
  exports: [EnvironmentService],
})
export class EnvConfigModule implements OnModuleInit {
  private readonly logger: Logger = new Logger(EnvConfigModule.name);
  onModuleInit(): any {
    this.logger.verbose('Environments initialized');
  }
}
