import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000).then(()=>{
    const logger = new Logger("APP")
    logger.log(`\n\nthe nestjs server work on : http://localhost:${process.env.PORT}`)
  });
}

void bootstrap();
