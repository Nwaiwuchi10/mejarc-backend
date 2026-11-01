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
exports.UserController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const user_service_1 = require("./user.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const login_dto_1 = require("./dto/login.dto");
const pagination_dto_1 = require("../utils/pagination.dto");
const user_guard_1 = require("./guard/user.guard");
const notification_settings_dto_1 = require("./dto/notification-settings.dto");
const platform_express_1 = require("@nestjs/platform-express");
const aws_s3_config_1 = require("../utils/aws-s3.config");
const multerS3 = require("multer-s3");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async create(file, dto) {
        const parsedDto = dto ? JSON.parse(dto) : {};
        return this.userService.create(parsedDto, file);
    }
    creates(createUserDto) {
        return this.userService.create(createUserDto);
    }
    async login(loginDto) {
        return this.userService.initiateLogin(loginDto);
    }
    async verifyLoginToken(verifyDto) {
        return this.userService.verifyLoginToken(verifyDto);
    }
    forgotPassword(email) {
        return this.userService.forgotPassword(email);
    }
    resetPassword(token, newPassword) {
        return this.userService.resetPassword(token, newPassword);
    }
    findAll(paginationDto) {
        return this.userService.findAll(paginationDto);
    }
    findOne(id) {
        return this.userService.findOne(id);
    }
    remove(id) {
        return this.userService.remove(id);
    }
    async updateProfile(req, file, dto) {
        const userId = req.userId;
        const parsedDto = dto ? JSON.parse(dto) : {};
        return this.userService.update(userId, parsedDto, file);
    }
    async getNotificationSettings(req) {
        return this.userService.getNotificationSettings(req.userId);
    }
    async updateNotificationSettings(req, dto) {
        return this.userService.updateNotificationSettings(req.userId, dto);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Register a new user with optional profile image',
        description: 'Registers a user account with multipart form data containing optional profile photo and JSON dto string',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                imgFile: {
                    type: 'string',
                    format: 'binary',
                    description: 'Profile picture image file (max 100MB)',
                },
                dto: {
                    type: 'string',
                    description: 'JSON stringified CreateUserDto payload e.g. {"name":"John","email":"john@example.com","password":"secret","phoneNumber":"+1234567890"}',
                    example: '{"name":"John Doe","email":"john@example.com","password":"Password123!","phoneNumber":"+1234567890"}',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User successfully created' }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Validation error / email already exists',
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('imgFile', {
        storage: multerS3({
            s3: aws_s3_config_1.s3Client,
            bucket: aws_s3_config_1.AWS_S3_BUCKET_NAME,
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: (req, file, cb) => {
                const sanitized = file.originalname
                    .replace(/\s+/g, '')
                    .replace(/[^a-zA-Z0-9.-]/g, '');
                cb(null, `user-profile-pics/${Date.now()}-${sanitized}`);
            },
        }),
        limits: { fileSize: 100 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('dto')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('/creates'),
    (0, swagger_1.ApiOperation)({
        summary: 'Register user with JSON body',
        description: 'Alternative JSON-only endpoint for user registration without file upload',
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User successfully created' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "creates", null);
__decorate([
    (0, common_1.Post)('/login'),
    (0, swagger_1.ApiOperation)({
        summary: 'Initiate user login',
        description: 'Validates credentials and sends a 6-digit OTP login verification token to the user email',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'OTP token sent to email' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid email or password' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginRequestDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Verify login OTP token',
        description: 'Verifies the email OTP token and returns the JWT authorization token and user profile' }),
    (0, common_1.Post)('/verify-login-token'),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Authentication successful, returns JWT token',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid or expired OTP token' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.VerifyLoginTokenDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "verifyLoginToken", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, swagger_1.ApiOperation)({
        summary: 'Request password reset token',
        description: 'Sends password reset link / token to registered email address',
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                email: { type: 'string', example: 'user@example.com' },
            },
            required: ['email'],
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Reset token dispatched if email exists',
    }),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    (0, swagger_1.ApiOperation)({
        summary: 'Reset password with token',
        description: 'Sets a new password using the reset token received via email',
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                token: { type: 'string', example: 'reset-token-uuid-or-code' },
                newPassword: { type: 'string', example: 'NewSecurePassword123!' },
            },
            required: ['token', 'newPassword'],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Password reset successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid or expired token' }),
    __param(0, (0, common_1.Body)('token')),
    __param(1, (0, common_1.Body)('newPassword')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get paginated list of all users',
        description: 'Returns paginated list of users',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated user list' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get user by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete user by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User deleted' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "remove", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update current logged-in user profile',
        description: 'Updates profile information and optional profile picture' }),
    (0, common_1.Patch)('profile'),
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                imgFile: {
                    type: 'string',
                    format: 'binary',
                    description: 'New profile photo file',
                },
                dto: {
                    type: 'string',
                    description: 'JSON stringified UpdateUserDto object',
                    example: '{"name":"John Updated","phoneNumber":"+1234567890"}',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Profile updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Unauthorized' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('imgFile', {
        storage: multerS3({
            s3: aws_s3_config_1.s3Client,
            bucket: aws_s3_config_1.AWS_S3_BUCKET_NAME,
            contentType: multerS3.AUTO_CONTENT_TYPE,
            key: (req, file, cb) => {
                const sanitized = file.originalname
                    .replace(/\s+/g, '')
                    .replace(/[^a-zA-Z0-9.-]/g, '');
                cb(null, `user-profile-pics/${Date.now()}-${sanitized}`);
            },
        }),
        limits: { fileSize: 100 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)('dto')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)('profile/notification-settings'),
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user notification settings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notification settings retrieved' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getNotificationSettings", null);
__decorate([
    (0, common_1.Patch)('profile/notification-settings'),
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Update current user notification settings' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notification settings updated' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, notification_settings_dto_1.UpdateNotificationSettingsDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateNotificationSettings", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('User'),
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map