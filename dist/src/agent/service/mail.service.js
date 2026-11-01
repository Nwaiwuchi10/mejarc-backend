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
var AgentMailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentMailService = void 0;
const nodemailer_mailer_1 = require("../../utils/nodemailer-mailer");
const common_1 = require("@nestjs/common");
const dotenv = require("dotenv");
const SibApiV3Sdk = require("sib-api-v3-sdk");
dotenv.config();
let AgentMailService = AgentMailService_1 = class AgentMailService {
    constructor() {
        this.logger = new common_1.Logger(AgentMailService_1.name);
        const defaultClient = SibApiV3Sdk.ApiClient.instance;
        const apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.BREVO_API_KEY;
        this.brevoClient = nodemailer_mailer_1.NodemailerMailer;
    }
    async sendKycUploadedNotification(adminUser, agent) {
        try {
            const mailOptions = {
                sender: {
                    name: 'KYC Notifications',
                    email: process.env.MAIL_FROM,
                },
                to: [
                    {
                        email: adminUser.email,
                        name: adminUser.firstName,
                    },
                ],
                subject: `New KYC uploaded for agent ${agent.id}`,
                htmlContent: this.buildTemplate({
                    title: `New KYC Uploaded`,
                    subtitle: `Agent ${agent.businessName || agent.userId} uploaded KYC documents.`,
                    user: adminUser,
                    footerNote: `Review the uploaded documents and approve or reject the agent account.`,
                }),
            };
            await this.brevoClient.sendTransacEmail(mailOptions);
        }
        catch (err) {
            this.logger.warn('Failed to send KYC uploaded notification', err?.toString());
        }
    }
    async sendAgentApprovalNotification(agentUser, agent, approved) {
        try {
            const status = approved ? 'approved' : 'rejected';
            const mailOptions = {
                sender: {
                    name: 'KYC Notifications',
                    email: process.env.MAIL_FROM,
                },
                to: [
                    {
                        email: agentUser.email,
                        name: agentUser.firstName,
                    },
                ],
                subject: `Your agent account has been ${status}`,
                htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width:700px; margin:0 auto; padding:20px; background:#fff; border-radius:8px;">
            <h2>${approved ? 'Congratulations!' : 'Update on your application'}</h2>
            <p>Hi ${agentUser.firstName},</p>
            <p>Your agent application for <b>${agent.businessName || agentUser.email}</b> has been <b>${status}</b>.</p>
            ${approved ? `<p>You can now access agent features in your dashboard.</p>` : `<p>Please review the feedback and re-submit the required documents.</p>`}
            <p>Best regards,<br/>Support Team</p>
          </div>
        `,
            };
            await this.brevoClient.sendTransacEmail(mailOptions);
        }
        catch (err) {
            this.logger.warn('Failed to send agent approval notification', err?.toString());
        }
    }
    async sendAgentRejectionNotification(agentUser, agent, reason) {
        try {
            const mailOptions = {
                sender: {
                    name: 'Registration Team',
                    email: process.env.MAIL_FROM,
                },
                to: [
                    {
                        email: agentUser.email,
                        name: agentUser.firstName,
                    },
                ],
                subject: `Agent Registration Requires Additional Information`,
                htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 25px; background-color: #f9fafb; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 25px;">
              <h1 style="color: #dc2626; font-size: 24px; margin: 0;">⚠️ Application Review</h1>
              <p style="color: #6b7280; font-size: 15px;">We need additional information</p>
            </div>
            <div style="background: #ffffff; padding: 20px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
              <h3 style="color: #111827; font-size: 16px; margin-bottom: 10px;">📝 Reason(s) for Review</h3>
              <div style="background: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #fbbf24;">
                <p style="color: #374151; font-size: 14px; line-height: 1.6; margin: 0;">${reason}</p>
              </div>
            </div>
            <div style="text-align: center; margin-top: 25px; color: #6b7280; font-size: 14px;">
              <p>Best regards,<br><b>MEJARC Registration Team</b></p>
            </div>
          </div>
        `,
            };
            await this.brevoClient.sendTransacEmail(mailOptions);
        }
        catch (err) {
            this.logger.warn('Failed to send agent rejection notification', err?.toString());
        }
    }
    async sendAgentRegistrationSubmittedNotification(agentUser, agent) {
        try {
            const mailOptions = {
                sender: {
                    name: 'Registration Team',
                    email: process.env.MAIL_FROM,
                },
                to: [
                    {
                        email: agentUser.email,
                        name: agentUser.firstName,
                    },
                ],
                subject: `📋 Agent Registration Submitted for Review`,
                htmlContent: this.buildTemplate({
                    title: `✅ Registration Submitted`,
                    subtitle: `Your application is being reviewed`,
                    user: agentUser,
                    footerNote: 'Your application is under review by our team.',
                }),
            };
            await this.brevoClient.sendTransacEmail(mailOptions);
        }
        catch (err) {
            this.logger.warn('Failed to send registration submitted notification', err?.toString());
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
        <p>Best regards,<br><b>Registration Team</b></p>
      </div>
    </div>
    `;
    }
};
exports.AgentMailService = AgentMailService;
exports.AgentMailService = AgentMailService = AgentMailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AgentMailService);
//# sourceMappingURL=mail.service.js.map