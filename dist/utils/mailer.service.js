"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NodemailerTransportService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailerService = exports.NodemailerTransportService = void 0;
const nodemailer = require("nodemailer");
const common_1 = require("@nestjs/common");
let NodemailerTransportService = NodemailerTransportService_1 = class NodemailerTransportService {
    constructor() {
        this.logger = new common_1.Logger(NodemailerTransportService_1.name);
        const user = process.env.GMAIL_USER || 'carneizltd@gmail.com';
        const pass = (process.env.GMAIL_PASS || 'ljdc ducb dwkq stdo').replace(/\s+/g, '');
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user,
                pass,
            },
        });
    }
    async sendMail(options) {
        const sender = process.env.GMAIL_USER || 'carneizltd@gmail.com';
        try {
            const info = await this.transporter.sendMail({
                from: `"Mejarc" <${sender}>`,
                to: options.to,
                subject: options.subject,
                html: options.html,
                text: options.text,
                attachments: options.attachments,
            });
            this.logger.log(`Email sent successfully: ${info.messageId}`);
            return info;
        }
        catch (err) {
            this.logger.error(`Error sending email to ${options.to}: ${err.message || err}`);
            throw err;
        }
    }
    getTransporter() {
        return this.transporter;
    }
};
exports.NodemailerTransportService = NodemailerTransportService;
exports.NodemailerTransportService = NodemailerTransportService = NodemailerTransportService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], NodemailerTransportService);
exports.mailerService = new NodemailerTransportService();
//# sourceMappingURL=mailer.service.js.map