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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contact_service_1 = require("./contact.service");
const create_contact_dto_1 = require("./dto/create-contact.dto");
const admin_auth_guard_1 = require("../admin/guards/admin-auth.guard");
const platform_express_1 = require("@nestjs/platform-express");
const aws_s3_config_1 = require("../utils/aws-s3.config");
let ContactController = class ContactController {
    constructor(contactService) {
        this.contactService = contactService;
    }
    create(createContactDto, files) {
        const images = files?.map((f) => f.location) || [];
        return this.contactService.create({ ...createContactDto, images });
    }
    findAll() {
        return this.contactService.findAll();
    }
};
exports.ContactController = ContactController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Submit a contact / support inquiry',
        description: 'Submit contact message with optional file/image attachments',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string', example: 'John Doe' },
                email: { type: 'string', example: 'john@example.com' },
                phone: { type: 'string', example: '+2348012345678' },
                subject: { type: 'string', example: 'General Inquiry' },
                message: {
                    type: 'string',
                    example: 'Hello, I have a question about your architectural plans.',
                },
                images: {
                    type: 'array',
                    items: { type: 'string', format: 'binary' },
                    description: 'Optional image attachments (max 10, up to 10MB each)',
                },
            },
            required: ['name', 'email', 'phone', 'message'],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Inquiry submitted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request / validation error' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('images', 10, {
        storage: (0, aws_s3_config_1.createS3Storage)('contact-inquiries'),
        limits: { fileSize: 10 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_contact_dto_1.CreateContactDto, Array]),
    __metadata("design:returntype", void 0)
], ContactController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all contact inquiries',
        description: 'Retrieve all submitted contact inquiries (Admin only)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of inquiries retrieved successfully',
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ContactController.prototype, "findAll", null);
exports.ContactController = ContactController = __decorate([
    (0, swagger_1.ApiTags)('Contact'),
    (0, common_1.Controller)('contact'),
    __metadata("design:paramtypes", [contact_service_1.ContactService])
], ContactController);
//# sourceMappingURL=contact.controller.js.map