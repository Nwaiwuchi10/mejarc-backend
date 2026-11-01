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
var MarketProductMailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketProductMailService = void 0;
const nodemailer_mailer_1 = require("../../utils/nodemailer-mailer");
const common_1 = require("@nestjs/common");
const dotenv = require("dotenv");
const SibApiV3Sdk = require("sib-api-v3-sdk");
dotenv.config();
let MarketProductMailService = MarketProductMailService_1 = class MarketProductMailService {
    constructor() {
        this.logger = new common_1.Logger(MarketProductMailService_1.name);
        const defaultClient = SibApiV3Sdk.ApiClient.instance;
        const apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.BREVO_API_KEY;
        this.brevoClient = nodemailer_mailer_1.NodemailerMailer;
    }
    async sendProductSubmittedNotification(agentUser, product) {
        try {
            const mailOptions = {
                sender: {
                    name: 'Security Team',
                    email: process.env.MAIL_FROM,
                },
                to: [
                    {
                        email: agentUser.email,
                        name: agentUser.firstName,
                    },
                ],
                subject: `📦 Product Listing Submitted: ${product.title}`,
                htmlContent: this.buildTemplate({
                    title: `Product Submitted for Review`,
                    subtitle: `Your product "${product.title}" has been successfully uploaded and is awaiting admin approval.`,
                    user: agentUser,
                    footerNote: 'We will notify you once your product is approved and live on the marketplace.',
                }),
            };
            await this.brevoClient.sendTransacEmail(mailOptions);
        }
        catch (err) {
            this.logger.warn('Failed to send product submitted notification', err?.toString());
        }
    }
    buildTemplate({ title, subtitle, user, footerNote, }) {
        return `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 25px; background-color: #f9fafb; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 25px;">
        <h1 style="color: #111827; font-size: 22px; margin: 0;">${title}</h1>
        <p style="color: #6b7280; font-size: 15px;">${subtitle}</p>
      </div>
      <div style="background: #ffffff; padding: 20px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
        <h2 style="color: #111827; font-size: 18px; margin-bottom: 12px;">👤 Personal Details</h2>
        <p style="margin: 6px 0;"><b>Full Name:</b> ${user.firstName} ${user.lastName}</p>
        <p style="margin: 6px 0;"><b>Email:</b> ${user.email}</p>
      </div>
      <div style="text-align: center; margin-top: 25px; color: #6b7280; font-size: 14px;">
        <p>${footerNote}</p>
        <p>Best regards,<br><b>Marketplace Team</b></p>
      </div>
    </div>
    `;
    }
};
exports.MarketProductMailService = MarketProductMailService;
exports.MarketProductMailService = MarketProductMailService = MarketProductMailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MarketProductMailService);
//# sourceMappingURL=mail.service.js.map