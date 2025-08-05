import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as morgan from "morgan"
import { nestjsFilter } from '@Package/error';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app: NestApplication = await NestFactory.create(AppModule)
  app.enableCors();
  app.setGlobalPrefix('api')
  app.use(morgan("dev"))
  nestjsFilter(app)

  const config = new DocumentBuilder().build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000).then(()=>{
    const logger = new Logger("APP")
    logger.log(`\n\nthe nestjs server work on : http://localhost:${process.env.PORT}`)
  });
}

void bootstrap();
