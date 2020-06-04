import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap')
  const port = 3000
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(port);

  logger.log(`Application listening on ${port}`)
}
bootstrap();
