module.exports = async (req, res) => {
  const envSummary = {
    hasMongoUri: !!process.env.MONGO_URI,
    hasMongodbUri: !!process.env.MONGODB_URI,
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasAwsKey: !!process.env.AWS_ACCESS_KEY_ID,
    nodeVersion: process.version,
    allEnvKeys: Object.keys(process.env).filter(k => !k.startsWith("npm_")),
  };

  try {
    const { NestFactory } = require('@nestjs/core');
    const { AppModule } = require('../dist/src/app.module');
    const bodyParser = require('body-parser');
    const { ValidationPipe } = require('@nestjs/common');
    const { ExpressAdapter } = require('@nestjs/platform-express');
    const express = require('express');

    if (!global.__nestServer) {
      const server = express();
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
      global.__nestServer = server;
    }

    return global.__nestServer(req, res);
  } catch (err) {
    return res.status(200).json({
      status: "BOOTSTRAP_DIAGNOSTIC_FAILURE",
      errorMessage: err && err.message ? err.message : String(err),
      errorName: err && err.name ? err.name : "Error",
      stack: err && err.stack ? err.stack.split("\n") : [],
      envSummary,
    });
  }
};
