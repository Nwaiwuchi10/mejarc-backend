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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const user_entity_1 = require("./entities/user.entity");
const database_module_1 = require("../database/database.module");
const user_adress_entity_1 = require("./entities/user-adress.entity");
const database_module_2 = require("../database/database.module");
const mail_service_1 = require("./service/mail.service");
const agent_entity_1 = require("../agent/entities/agent.entity");
const database_module_3 = require("../database/database.module");
const user_notification_setting_entity_1 = require("./entities/user-notification-setting.entity");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
let UserService = class UserService {
    constructor(dataSource, userRepo, addressRepo, agentRepo, settingsRepo, mailService, jwtService) {
        this.dataSource = dataSource;
        this.userRepo = userRepo;
        this.addressRepo = addressRepo;
        this.agentRepo = agentRepo;
        this.settingsRepo = settingsRepo;
        this.mailService = mailService;
        this.jwtService = jwtService;
    }
    async create(dto, file) {
        return this.dataSource.transaction(async (manager) => {
            const cleanEmail = dto.email ? dto.email.trim().toLowerCase() : '';
            const emailExists = await manager.findOne(user_entity_1.User, {
                where: { email: cleanEmail },
                withDeleted: true,
            });
            if (emailExists) {
                throw new common_1.BadRequestException('Email already in use');
            }
            if (dto.phoneNumber) {
                const cleanPhone = dto.phoneNumber.trim();
                const phoneExists = await manager.findOne(user_entity_1.User, {
                    where: { phoneNumber: cleanPhone },
                    withDeleted: true,
                });
                if (phoneExists) {
                    throw new common_1.BadRequestException('Phone number already in use');
                }
            }
            let profilePics;
            if (file) {
                const uploadedFile = file;
                if (!uploadedFile.location) {
                    throw new common_1.BadRequestException('File upload failed: location missing');
                }
                profilePics = uploadedFile.location;
            }
            let address;
            if (dto.address) {
                address = manager.create(user_adress_entity_1.UserAddress, {
                    ...dto.address,
                });
            }
            const user = manager.create(user_entity_1.User, {
                firstName: dto.firstName,
                lastName: dto.lastName,
                name: `${dto.firstName} ${dto.lastName}`,
                email: cleanEmail,
                phoneNumber: dto.phoneNumber ? dto.phoneNumber.trim() : undefined,
                password: dto.password,
                profilePics,
                address,
                notificationSettings: manager.create(user_notification_setting_entity_1.UserNotificationSetting, {}),
            });
            const savedUser = await manager.save(user_entity_1.User, user);
            await this.mailService.staffOnboardingMail(savedUser);
            return savedUser;
        });
    }
    async initiateLogin(loginDto) {
        const cleanEmail = loginDto.email
            ? loginDto.email.trim().toLowerCase()
            : '';
        const user = await this.userRepo.findOne({
            where: { email: cleanEmail },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        if (user.isSuspended) {
            throw new common_1.UnauthorizedException('Your account has been suspended. Please contact support.');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password || '');
        if (!isPasswordValid) {
            user.loginAttempts = (user.loginAttempts || 0) + 1;
            user.lastLoginAttempt = new Date();
            if (user.loginAttempts >= 5) {
                user.isSuspended = true;
                await this.userRepo.save(user);
                throw new common_1.UnauthorizedException('Account locked due to multiple failed login attempts. Please contact support.');
            }
            await this.userRepo.save(user);
            throw new common_1.UnauthorizedException('Invalid email or password');
        }
        user.loginAttempts = 0;
        user.lastLoginAttempt = new Date();
        const verificationToken = crypto
            .randomBytes(3)
            .toString('hex')
            .toUpperCase();
        const expiryTime = new Date();
        expiryTime.setMinutes(expiryTime.getMinutes() + 15);
        user.loginVerificationToken = verificationToken;
        user.loginVerificationTokenExpiry = expiryTime;
        await this.userRepo.save(user);
        await this.mailService.sendLoginVerificationEmail(user.email, user.firstName, verificationToken);
        return {
            success: true,
            message: 'Verification code sent to your email. Please check your inbox.',
            email: user.email,
            expiresIn: '15 minutes',
        };
    }
    async verifyLoginToken(verifyDto) {
        const user = await this.userRepo.findOne({
            where: { email: verifyDto.email },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        if (!user.loginVerificationToken) {
            throw new common_1.UnauthorizedException('No verification token found. Please login first.');
        }
        if (user.loginVerificationTokenExpiry &&
            user.loginVerificationTokenExpiry < new Date()) {
            user.loginVerificationToken = undefined;
            user.loginVerificationTokenExpiry = undefined;
            await this.userRepo.save(user);
            throw new common_1.UnauthorizedException('Verification token has expired. Please login again.');
        }
        if (user.loginVerificationToken !== verifyDto.verificationToken) {
            throw new common_1.UnauthorizedException('Invalid verification token');
        }
        user.isEmailVerified = true;
        user.loginVerificationToken = undefined;
        user.loginVerificationTokenExpiry = undefined;
        user.loginAttempts = 0;
        const updatedUser = await this.userRepo.save(user);
        const agentRecord = await this.agentRepo.findOne({
            where: { userId: updatedUser.id },
        });
        const isAgent = !!agentRecord;
        let isAgentApproved = false;
        if (agentRecord) {
            if (agentRecord.registrationStatus === agent_entity_1.AgentRegistrationStatus.REJECTED) {
                throw new common_1.UnauthorizedException(`Your agent account has been rejected. Reason: ${agentRecord.rejectionReason || 'Contact support'}.`);
            }
            isAgentApproved =
                agentRecord.registrationStatus === agent_entity_1.AgentRegistrationStatus.APPROVED;
        }
        try {
            await this.mailService.staffLoginMail(updatedUser);
        }
        catch (_) { }
        const { password, ...userDataWithoutPassword } = updatedUser;
        const userToken = this.jwtService.sign({
            userId: updatedUser.id,
            role: 'user',
        });
        const agentToken = isAgent && isAgentApproved
            ? this.jwtService.sign({
                userId: updatedUser.id,
                agentId: agentRecord.id,
                role: 'agent',
            })
            : undefined;
        return {
            success: true,
            message: isAgent && !isAgentApproved
                ? 'Login successful as user. Agent features are awaiting approval.'
                : 'Login successful',
            isAgent,
            isAgentApproved,
            userId: updatedUser.id,
            agentId: agentRecord?.id,
            role: isAgent && isAgentApproved ? 'agent' : 'user',
            user: userDataWithoutPassword,
            userToken,
            ...(agentToken && { agentToken }),
        };
    }
    async generateJWT(user) {
        return this.jwtService.sign({ userId: user.id, role: 'user' });
    }
    generateJwt(userId) {
        return this.jwtService.sign({ userId, role: 'user' });
    }
    async remove(id) {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        await this.userRepo.remove(user);
        return { message: `User with ID ${id} has been removed` };
    }
    async update(id, dto, file) {
        const user = await this.userRepo.findOne({
            where: { id },
            relations: ['address'],
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        if (file) {
            const uploadedFile = file;
            if (uploadedFile.location) {
                user.profilePics = uploadedFile.location;
            }
        }
        if (dto.address) {
            if (user.address) {
                Object.assign(user.address, dto.address);
            }
            else {
                user.address = this.addressRepo.create(dto.address);
            }
        }
        const agent = await this.agentRepo.findOne({ where: { userId: user.id } });
        if (agent) {
            const anyDto = dto;
            const isNameChange = (anyDto.firstName && anyDto.firstName !== user.firstName) ||
                (anyDto.lastName && anyDto.lastName !== user.lastName);
            const isEmailChange = anyDto.email && anyDto.email.trim().toLowerCase() !== user.email;
            if (isNameChange || isEmailChange) {
                agent.pendingProfileChange = {
                    pendingFirstName: anyDto.firstName || user.firstName,
                    pendingLastName: anyDto.lastName || user.lastName,
                    pendingEmail: anyDto.email ? anyDto.email.trim().toLowerCase() : user.email,
                    requestedAt: new Date(),
                    status: 'PENDING_ADMIN_APPROVAL',
                };
                await this.agentRepo.save(agent);
                delete anyDto.firstName;
                delete anyDto.lastName;
                delete anyDto.email;
            }
        }
        const { address, ...basicInfo } = dto;
        Object.assign(user, basicInfo);
        if (dto.firstName || dto.lastName) {
            user.name =
                `${user.firstName || user.lastName ? (user.firstName || '') + ' ' + (user.lastName || '') : user.name}`.trim();
        }
        const saved = await this.userRepo.save(user);
        if (agent && agent.pendingProfileChange?.status === 'PENDING_ADMIN_APPROVAL') {
            return {
                ...saved,
                pendingApprovalNotice: 'Name or email change request submitted. An admin must review and approve this change before it takes effect.',
            };
        }
        return saved;
    }
    async findAll(paginationDto) {
        const { page = 1, limit = 10, search } = paginationDto;
        const skip = (page - 1) * limit;
        const queryOptions = {
            order: { createdAt: 'DESC' },
            take: limit,
            skip: skip,
        };
        if (search) {
            queryOptions.where = [
                { firstName: (0, database_module_3.Like)(`%${search}%`) },
                { lastName: (0, database_module_3.Like)(`%${search}%`) },
                { email: (0, database_module_3.Like)(`%${search}%`) },
            ];
        }
        const [data, total] = await this.userRepo.findAndCount(queryOptions);
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const user = await this.userRepo.findOne({
            where: { id },
        });
        if (!user)
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        return user;
    }
    async forgotPassword(email) {
        const cleanEmail = email ? email.trim().toLowerCase() : '';
        const staff = await this.userRepo.findOne({ where: { email: cleanEmail } });
        if (!staff) {
            throw new common_1.NotFoundException('No user found with this email');
        }
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 10 * 60 * 1000);
        staff.resetToken = token;
        staff.resetTokenExpires = expires;
        await this.userRepo.save(staff);
        await this.mailService.sendPasswordResetEmail(staff.email, token);
        return {
            message: 'Password reset link sent successfully to your registered email address',
        };
    }
    async resetPassword(token, newPassword) {
        const staff = await this.userRepo.findOne({
            where: { resetToken: token },
        });
        if (!staff) {
            throw new common_1.BadRequestException('Invalid token');
        }
        if (staff.resetTokenExpires < new Date()) {
            throw new common_1.BadRequestException('Reset token expired');
        }
        const salt = await bcrypt.genSalt(10);
        staff.password = await bcrypt.hash(newPassword, salt);
        staff.resetToken = null;
        staff.resetTokenExpires = null;
        await this.userRepo.save(staff);
        return { message: 'Password successfully reset' };
    }
    async getNotificationSettings(userId) {
        let settings = await this.settingsRepo.findOne({ where: { userId } });
        if (!settings) {
            settings = this.settingsRepo.create({ userId });
            await this.settingsRepo.save(settings);
        }
        return settings;
    }
    async updateNotificationSettings(userId, dto) {
        const settings = await this.getNotificationSettings(userId);
        Object.assign(settings, dto);
        return this.settingsRepo.save(settings);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, database_module_2.InjectRepository)(user_entity_1.User)),
    __param(2, (0, database_module_2.InjectRepository)(user_adress_entity_1.UserAddress)),
    __param(3, (0, database_module_2.InjectRepository)(agent_entity_1.Agent)),
    __param(4, (0, database_module_2.InjectRepository)(user_notification_setting_entity_1.UserNotificationSetting)),
    __metadata("design:paramtypes", [database_module_1.DataSource, Object, Object, Object, Object, mail_service_1.MailService,
        jwt_1.JwtService])
], UserService);
//# sourceMappingURL=user.service.js.map