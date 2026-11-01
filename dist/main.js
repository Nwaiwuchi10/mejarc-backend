"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNestServer = createNestServer;
exports.default = handler;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const bodyParser = require("body-parser");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const fs = require("fs");
const path = require("path");
let appInstance = null;
async function createNestServer() {
    if (!appInstance) {
        const app = await core_1.NestFactory.create(app_module_1.AppModule, {
            cors: true,
        });
        app.use(bodyParser.json({ limit: '50mb' }));
        app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
        app.enableCors({
            origin: true,
            credentials: true,
            methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        });
        app.useGlobalPipes(new common_1.ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Mejarc API')
            .setDescription('Comprehensive REST API documentation for Mejarc Backend services, including Authentication, User Management, Agent Management, Marketplace, Custom Design Wizard, Orders, Payments, Wallet & Withdrawals, Notifications, and Real-Time Chat.')
            .setVersion('1.0')
            .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'JWT',
            description: 'Enter your Bearer token in format: Bearer <token>',
            in: 'header',
        }, 'JWT-auth')
            .addTag('Health / App', 'Root application and health check endpoints')
            .addTag('User', 'User registration, authentication, profiles, and settings')
            .addTag('Agent', 'Agent onboarding, KYC verification, profile, and analytics')
            .addTag('Admin', 'Admin authentication, users, moderation, approvals, roles, and financials')
            .addTag('Order', 'Order management, Paystack checkout, payments, and tracking')
            .addTag('Marketplace Product', 'Listing, searching, and managing marketplace architecture and design products')
            .addTag('Custom Design', '6-step custom architectural design wizard, pricing, and project submissions')
            .addTag('Custom Design Workspace', 'Custom design project workspace, milestones, files, and activity logs')
            .addTag('Wallet', 'Wallet balances, bank accounts, withdrawals, and transactions')
            .addTag('Notification', 'User and agent in-app notification center')
            .addTag('Chat', 'Direct messaging, custom design conversations, and attachments')
            .addTag('Contact', 'Contact inquiries and customer support messages')
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        const swaggerCustomOptions = {
            customSiteTitle: 'Mejarc API Documentation',
            swaggerOptions: {
                persistAuthorization: true,
                docExpansion: 'none',
                filter: true,
                showRequestDuration: true,
            },
        };
        swagger_1.SwaggerModule.setup('docs', app, document, swaggerCustomOptions);
        swagger_1.SwaggerModule.setup('swagger', app, document, swaggerCustomOptions);
        swagger_1.SwaggerModule.setup('api/docs', app, document, swaggerCustomOptions);
        swagger_1.SwaggerModule.setup('api', app, document, swaggerCustomOptions);
        const httpAdapter = app.getHttpAdapter();
        httpAdapter.get('/swagger.json', (req, res) => {
            res.json(document);
        });
        httpAdapter.get('/docs.json', (req, res) => {
            res.json(document);
        });
        httpAdapter.get('/api/docs.json', (req, res) => {
            res.json(document);
        });
        httpAdapter.get('/api-json', (req, res) => {
            res.json(document);
        });
        httpAdapter.get('/docs-json', (req, res) => {
            res.json(document);
        });
        await app.init();
        appInstance = app.getHttpAdapter().getInstance();
    }
    return appInstance;
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        cors: true,
    });
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.enableCors({
        origin: [
            'https://mejarc.onrender.com',
            'https://admin-app-mv4j.onrender.com',
            'https://mejarc-admin-portal.vercel.app',
            'http://10.161.5.213:3000',
            'http://localhost:3000',
            'http://localhost:3001',
            'http://10.161.5.213:3000',
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Mejarc API')
        .setDescription('Comprehensive REST API documentation for Mejarc Backend services, including Authentication, User Management, Agent Management, Marketplace, Custom Design Wizard, Orders, Payments, Wallet & Withdrawals, Notifications, and Real-Time Chat.')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter your Bearer token in format: Bearer <token>',
        in: 'header',
    }, 'JWT-auth')
        .addTag('Health / App', 'Root application and health check endpoints')
        .addTag('User', 'User registration, authentication, profiles, and settings')
        .addTag('Agent', 'Agent onboarding, KYC verification, profile, and analytics')
        .addTag('Admin', 'Admin authentication, users, moderation, approvals, roles, and financials')
        .addTag('Order', 'Order management, Paystack checkout, payments, and tracking')
        .addTag('Marketplace Product', 'Listing, searching, and managing marketplace architecture and design products')
        .addTag('Custom Design', '6-step custom architectural design wizard, pricing, and project submissions')
        .addTag('Custom Design Workspace', 'Custom design project workspace, milestones, files, and activity logs')
        .addTag('Wallet', 'Wallet balances, bank accounts, withdrawals, and transactions')
        .addTag('Notification', 'User and agent in-app notification center')
        .addTag('Chat', 'Direct messaging, custom design conversations, and attachments')
        .addTag('Contact', 'Contact inquiries and customer support messages')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    const swaggerCustomOptions = {
        customSiteTitle: 'Mejarc API Documentation',
        swaggerOptions: {
            persistAuthorization: true,
            docExpansion: 'none',
            filter: true,
            showRequestDuration: true,
        },
    };
    swagger_1.SwaggerModule.setup('docs', app, document, swaggerCustomOptions);
    swagger_1.SwaggerModule.setup('swagger', app, document, swaggerCustomOptions);
    swagger_1.SwaggerModule.setup('api/docs', app, document, swaggerCustomOptions);
    swagger_1.SwaggerModule.setup('api', app, document, swaggerCustomOptions);
    const httpAdapter = app.getHttpAdapter();
    httpAdapter.get('/swagger.json', (req, res) => {
        res.json(document);
    });
    httpAdapter.get('/docs.json', (req, res) => {
        res.json(document);
    });
    httpAdapter.get('/api/docs.json', (req, res) => {
        res.json(document);
    });
    httpAdapter.get('/api-json', (req, res) => {
        res.json(document);
    });
    httpAdapter.get('/docs-json', (req, res) => {
        res.json(document);
    });
    try {
        const swaggerJsonPath = path.join(process.cwd(), 'swagger.json');
        fs.writeFileSync(swaggerJsonPath, JSON.stringify(document, null, 2), 'utf8');
    }
    catch (err) {
        console.warn('Could not write swagger.json file to disk:', err);
    }
    const port = process.env.PORT ?? 4500;
    await app.listen(port);
    console.log(`🚀 Application is running on port ${port}`);
    console.log(`📖 Swagger UI available at: http://localhost:${port}/docs`);
    console.log(`📄 Swagger JSON available at: http://localhost:${port}/swagger.json`);
}
if (!process.env.VERCEL) {
    bootstrap();
}
async function handler(req, res) {
    try {
        const server = await createNestServer();
        return server(req, res);
    }
    catch (err) {
        console.error('VERCEL CRASH ERROR:', err);
        return res.status(200).json({
            status: 'VERCEL_NEST_INITIALIZATION_ERROR',
            error: err?.message || String(err),
            stack: err?.stack,
            envCheck: {
                hasMongoUri: !!(process.env.MONGO_URI || process.env.MONGODB_URI),
                hasJwtSecret: !!process.env.JWT_SECRET,
                nodeVersion: process.version,
            },
        });
    }
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = handler;
    module.exports.default = handler;
    module.exports.createNestServer = createNestServer;
}
//# sourceMappingURL=main.js.map