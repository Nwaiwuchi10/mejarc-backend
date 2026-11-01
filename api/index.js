const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('../dist/src/app.module');
const bodyParser = require('body-parser');
const { ValidationPipe } = require('@nestjs/common');
const { ExpressAdapter } = require('@nestjs/platform-express');
const express = require('express');

const server = express();
let isAppInitialized = false;

async function bootstrap() {
  if (!isAppInitialized) {
    const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
      cors: true,
      logger: ['error', 'warn', 'log'],
    });

    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

    app.enableCors({
      origin: '*',
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

module.exports = async (req, res) => {
  try {
    await bootstrap();
    server(req, res);
  } catch (err) {
    console.error('Fatal Serverless Bootstrap Error:', err);
    res.status(500).json({
      error: 'Vercel Serverless Function Error',
      message: err && err.message ? err.message : String(err),
      name: err && err.name ? err.name : 'UnknownError',
      stack: err && err.stack ? err.stack : undefined,
    });
  }
};
