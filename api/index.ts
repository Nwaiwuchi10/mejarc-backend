import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import * as bodyParser from 'body-parser';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';

const server = express();
let isAppInitialized = false;

async function bootstrap() {
  if (!isAppInitialized) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
      cors: true,
    });

    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

    app.enableCors({
      origin: [
        'https://mejarc.onrender.com',
        'https://admin-app-mv4j.onrender.com',
        'https://mejarc-admin-portal.vercel.app',
        'http://localhost:3000',
        'http://localhost:3001',
      ],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    isAppInitialized = true;
  }
  return server;
}

export default async function handler(req: any, res: any) {
  try {
    await bootstrap();
    server(req, res);
  } catch (err: any) {
    console.error('Vercel handler bootstrap error:', err);
    res.status(500).json({
      error: 'Vercel Serverless Initialization Error',
      message: err.message || err.toString(),
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
  }
}
