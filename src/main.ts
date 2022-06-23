import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';
import { AppModule } from './app.module';
import { createClient } from 'redis';
import * as RedisStore from 'connect-redis';
import { constants } from './constants';

import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const redisStore = RedisStore(session);
  const redisClient = createClient({
    url: constants.redisUrl,
    legacyMode: true,
  });
  await redisClient.connect();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(
    session({
      store: new redisStore({ client: redisClient }),
      secret: constants.sessionSecret,
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.enableCors({
    origin: constants.origin,
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
