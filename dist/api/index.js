"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const core_1 = require("@nestjs/core");
const app_module_1 = require("../src/app.module");
const bodyParser = require("body-parser");
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const express = require("express");
const server = express();
let isAppInitialized = false;
async function bootstrap() {
    if (!isAppInitialized) {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(server), {
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
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));
        await app.init();
        isAppInitialized = true;
    }
    return server;
}
async function handler(req, res) {
    try {
        await bootstrap();
        server(req, res);
    }
    catch (err) {
        console.error('Fatal Serverless Bootstrap Error:', err);
        res.status(500).json({
            error: 'Vercel Serverless Function Error',
            message: err?.message || String(err),
            name: err?.name,
            stack: err?.stack,
        });
    }
}
//# sourceMappingURL=index.js.map