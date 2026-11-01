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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ContactService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const nodemailer_mailer_1 = require("../utils/nodemailer-mailer");
const common_1 = require("@nestjs/common");
const database_module_1 = require("../database/database.module");
const contact_entity_1 = require("./entities/contact.entity");
const SibApiV3Sdk = require("sib-api-v3-sdk");
let ContactService = ContactService_1 = class ContactService {
    constructor(contactRepo) {
        this.contactRepo = contactRepo;
        this.logger = new common_1.Logger(ContactService_1.name);
        const defaultClient = SibApiV3Sdk.ApiClient.instance;
        const apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = process.env.BREVO_API_KEY;
        this.brevoClient = nodemailer_mailer_1.NodemailerMailer;
    }
    async create(dto) {
        const inquiry = this.contactRepo.create(dto);
        const saved = await this.contactRepo.save(inquiry);
        try {
            const mailOptions = {
                sender: {
                    name: 'Mejarc Contact Form',
                    email: process.env.MAIL_FROM || 'no-reply@mejarc.com',
                },
                to: [
                    {
                        email: 'mejehaarc@gmail.com',
                        name: 'Mejarc Admin',
                    },
                ],
                subject: `📩 New Contact Inquiry from ${saved.name}`,
                htmlContent: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #FFC700;">New Contact Inquiry Received</h2>
            <p><strong>Name:</strong> ${saved.name}</p>
            <p><strong>Email:</strong> ${saved.email}</p>
            <p><strong>Phone:</strong> ${saved.phone}</p>
            <p><strong>Subject:</strong> ${saved.subject || 'N/A'}</p>
            <hr style="border: 0; border-top: 1px border #ccc; margin: 20px 0;" />
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #FFC700;">${saved.message}</p>
            ${saved.images && saved.images.length > 0
                    ? `<h3>Attached Reference Pictures:</h3>
                   <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                     ${saved.images
                        .map((img) => `<a href="${img}" target="_blank" style="margin-right: 10px;"><img src="${img}" style="width: 120px; height: 120px; object-fit: cover; border-radius: 8px; border: 1px solid #ddd;" /></a>`)
                        .join('')}
                   </div>`
                    : ''}
          </div>
        `,
            };
            await this.brevoClient.sendTransacEmail(mailOptions);
        }
        catch (err) {
            this.logger.error('Failed to send contact email notification to admin', err);
        }
        return saved;
    }
    async findAll() {
        return this.contactRepo.find({
            order: { createdAt: 'DESC' },
        });
    }
};
exports.ContactService = ContactService;
exports.ContactService = ContactService = ContactService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, database_module_1.InjectRepository)(contact_entity_1.ContactInquiry)),
    __metadata("design:paramtypes", [Object])
], ContactService);
//# sourceMappingURL=contact.service.js.map