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
var AdminService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("../database/database.module");
const database_module_2 = require("../database/database.module");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const wallet_service_1 = require("../wallet/wallet.service");
const common_2 = require("@nestjs/common");
const admin_entity_1 = require("./entities/admin.entity");
const user_entity_1 = require("../user/entities/user.entity");
const user_adress_entity_1 = require("../user/entities/user-adress.entity");
const agent_entity_1 = require("../agent/entities/agent.entity");
const agent_service_1 = require("../agent/agent.service");
const mail_service_1 = require("../agent/service/mail.service");
const mail_service_2 = require("../user/service/mail.service");
const order_entity_1 = require("../order/entities/order.entity");
const marketproduct_entity_1 = require("../marketproduct/entities/marketproduct.entity");
const conversation_entity_1 = require("../chat/entities/conversation.entity");
const message_entity_1 = require("../chat/entities/message.entity");
const withdrawal_request_entity_1 = require("../wallet/entities/withdrawal-request.entity");
let AdminService = AdminService_1 = class AdminService {
    constructor(adminRepo, userRepo, agentRepo, orderRepo, marketProductRepo, conversationRepo, messageRepo, agentService, agentMailService, userMailService, jwtService, walletService) {
        this.adminRepo = adminRepo;
        this.userRepo = userRepo;
        this.agentRepo = agentRepo;
        this.orderRepo = orderRepo;
        this.marketProductRepo = marketProductRepo;
        this.conversationRepo = conversationRepo;
        this.messageRepo = messageRepo;
        this.agentService = agentService;
        this.agentMailService = agentMailService;
        this.userMailService = userMailService;
        this.jwtService = jwtService;
        this.walletService = walletService;
        this.logger = new common_1.Logger(AdminService_1.name);
        this.rolesStore = [
            {
                id: '1',
                name: 'Super Admin',
                department: 'Executive',
                users: 1,
                permissions: 'Full System Access',
                createdAt: new Date('2024-01-10'),
            },
            {
                id: '2',
                name: 'Project Manager',
                department: 'Operations',
                users: 6,
                permissions: 'Manage Projects, Assign Agents',
                createdAt: new Date('2024-01-15'),
            },
            {
                id: '3',
                name: 'Finance Manager',
                department: 'Finance',
                users: 3,
                permissions: 'Transactions, Refunds, Payouts',
                createdAt: new Date('2024-01-20'),
            },
            {
                id: '4',
                name: 'Support Manager',
                department: 'Customer Support',
                users: 5,
                permissions: 'Handle Disputes, Customer Issues',
                createdAt: new Date('2024-02-02'),
            },
        ];
    }
    async makeAdmin(userId, role) {
        this.validateUUID(userId, 'user ID');
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const existing = await this.adminRepo.findOne({ where: { userId } });
        if (existing)
            throw new common_1.ConflictException('User is already an admin');
        const admin = this.adminRepo.create({
            userId,
            user,
            role: role ?? 'admin',
            isAdmin: true,
            isActive: true,
        });
        const saved = await this.adminRepo.save(admin);
        this.logger.log(`User ${userId} promoted to admin`);
        const { user: _u, ...adminData } = saved;
        return {
            success: true,
            message: `User has been promoted to admin`,
            admin: adminData,
        };
    }
    async bootstrapFirstAdmin(email) {
        const adminCount = await this.adminRepo.count();
        if (adminCount > 0) {
            throw new common_1.ForbiddenException('Bootstrap endpoint is disabled. Admins already exist in the system.');
        }
        const cleanEmail = email ? email.trim().toLowerCase() : '';
        const user = await this.userRepo.findOne({ where: { email: cleanEmail } });
        if (!user) {
            throw new common_1.NotFoundException(`User with email ${email} not found.`);
        }
        const admin = this.adminRepo.create({
            userId: user.id,
            user,
            role: 'superadmin',
            isAdmin: true,
            isActive: true,
        });
        const saved = await this.adminRepo.save(admin);
        this.logger.log(`Bootstrap: User ${user.email} promoted to first admin successfully.`);
        const { user: _u, ...adminData } = saved;
        return {
            success: true,
            message: `User ${user.email} has been successfully promoted to the first admin. This endpoint is now disabled.`,
            admin: adminData,
        };
    }
    async adminLogin(email, password) {
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const adminRecord = await this.adminRepo.findOne({
            where: { userId: user.id },
        });
        if (!adminRecord || !adminRecord.isAdmin || !adminRecord.isActive) {
            throw new common_1.UnauthorizedException('Not authorised as admin');
        }
        const valid = await bcrypt.compare(password, user.password || '');
        if (!valid)
            throw new common_1.UnauthorizedException('Invalid credentials');
        const otp = crypto.randomBytes(3).toString('hex').toUpperCase();
        const expiry = new Date(Date.now() + 15 * 60 * 1000);
        user.loginVerificationToken = otp;
        user.loginVerificationTokenExpiry = expiry;
        await this.userRepo.save(user);
        try {
            await this.userMailService.sendLoginVerificationEmail(user.email, user.firstName, otp);
        }
        catch (err) {
            this.logger.warn('Failed to send admin OTP email', err);
        }
        return {
            success: true,
            message: 'OTP sent to admin email',
            email: user.email,
            expiresIn: '15 minutes',
        };
    }
    async verifyAdminLogin(email, token) {
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user)
            throw new common_1.UnauthorizedException('User not found');
        const adminRecord = await this.adminRepo.findOne({
            where: { userId: user.id },
        });
        if (!adminRecord)
            throw new common_1.UnauthorizedException('Not an admin');
        if (!user.loginVerificationToken) {
            throw new common_1.UnauthorizedException('No OTP found. Please login first.');
        }
        if (user.loginVerificationTokenExpiry &&
            user.loginVerificationTokenExpiry < new Date()) {
            user.loginVerificationToken = undefined;
            user.loginVerificationTokenExpiry = undefined;
            await this.userRepo.save(user);
            throw new common_1.UnauthorizedException('OTP expired. Please login again.');
        }
        if (user.loginVerificationToken !== token) {
            throw new common_1.UnauthorizedException('Invalid OTP');
        }
        user.loginVerificationToken = undefined;
        user.loginVerificationTokenExpiry = undefined;
        user.isEmailVerified = true;
        await this.userRepo.save(user);
        const adminToken = this.jwtService.sign({
            userId: user.id,
            adminId: adminRecord.id,
            role: 'admin',
        });
        const { password: _p, ...safeUser } = user;
        return {
            success: true,
            message: 'Admin login successful',
            adminToken,
            admin: {
                ...safeUser,
                adminId: adminRecord.id,
                adminRole: adminRecord.role,
            },
        };
    }
    async getAllAgents(paginationDto) {
        const { page = 1, limit = 10, search } = paginationDto;
        const skip = (page - 1) * limit;
        const queryOptions = {
            relations: ['user', 'profile', 'bioRecord', 'kycRecords'],
            order: { createdAt: 'DESC' },
            take: limit,
            skip: skip,
        };
        if (search) {
            queryOptions.where = [
                { businessName: (0, database_module_2.Like)(`%${search}%`) },
                { user: { firstName: (0, database_module_2.Like)(`%${search}%`) } },
                { user: { lastName: (0, database_module_2.Like)(`%${search}%`) } },
                { user: { email: (0, database_module_2.Like)(`%${search}%`) } },
            ];
        }
        const [agents, total] = await this.agentRepo.findAndCount(queryOptions);
        return {
            data: agents.map((agent) => this.formatAgentSummary(agent)),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async getAgentApplications(query) {
        const { page = 1, limit = 20, search, status, businessType } = query;
        const skip = (page - 1) * limit;
        const qb = this.agentRepo
            .createQueryBuilder('agent')
            .leftJoinAndSelect('agent.user', 'user')
            .leftJoinAndSelect('agent.profile', 'profile')
            .leftJoinAndSelect('agent.kycRecords', 'kycRecords');
        if (status && status !== 'All') {
            if (status === 'Pending') {
                qb.andWhere('agent.registrationStatus IN (:...statuses)', {
                    statuses: [
                        'awaiting_approval',
                        'kyc_pending',
                        'bio_pending',
                        'profile_pending',
                    ],
                });
            }
            else if (status === 'Approved') {
                qb.andWhere("agent.registrationStatus = 'approved'");
            }
            else if (status === 'Rejected') {
                qb.andWhere("agent.registrationStatus = 'rejected'");
            }
        }
        if (businessType && businessType !== 'All') {
            qb.andWhere('profile.preferredTitle = :businessType', { businessType });
        }
        if (search) {
            qb.andWhere('(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search OR agent.businessName ILIKE :search)', {
                search: `%${search}%`,
            });
        }
        qb.orderBy('agent.createdAt', 'DESC').take(limit).skip(skip);
        const [agents, total] = await qb.getManyAndCount();
        const data = agents.map((agent) => {
            let mappedStatus = 'Pending';
            if (agent.registrationStatus === 'approved') {
                mappedStatus = 'Approved';
            }
            else if (agent.registrationStatus === 'rejected') {
                mappedStatus = 'Rejected';
            }
            return {
                id: agent.id,
                vendorId: agent.vendorId || `VN${agent.id.slice(0, 4).toUpperCase()}`,
                name: agent.user
                    ? `${agent.user.firstName} ${agent.user.lastName}`
                    : agent.businessName || 'Agent',
                email: agent.user?.email || '',
                businessName: agent.businessName || 'N/A',
                pendingProfileChange: agent.pendingProfileChange ?? null,
                businessType: agent.profile?.preferredTitle || 'Building Designer',
                status: mappedStatus,
                createdAt: agent.createdAt,
                updatedAt: agent.updatedAt,
            };
        });
        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async getAgentDetail(agentId) {
        this.validateUUID(agentId, 'agent ID');
        const agent = await this.agentRepo.findOne({
            where: { id: agentId },
            relations: ['user', 'profile', 'bioRecord', 'kycRecords'],
        });
        if (!agent)
            throw new common_1.NotFoundException('Agent not found');
        return this.formatAgentDetail(agent);
    }
    async findAll(paginationDto) {
        const { page = 1, limit = 10, search } = paginationDto;
        const skip = (page - 1) * limit;
        const queryOptions = {
            relations: ['user'],
            take: limit,
            skip: skip,
        };
        if (search) {
            queryOptions.where = [
                { role: (0, database_module_2.Like)(`%${search}%`) },
                { user: { firstName: (0, database_module_2.Like)(`%${search}%`) } },
                { user: { lastName: (0, database_module_2.Like)(`%${search}%`) } },
                { user: { email: (0, database_module_2.Like)(`%${search}%`) } },
            ];
        }
        const [data, total] = await this.adminRepo.findAndCount(queryOptions);
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
        this.validateUUID(id, 'admin ID');
        return this.adminRepo.findOne({ where: { id }, relations: ['user'] });
    }
    async create(admin) {
        const ent = this.adminRepo.create(admin);
        return this.adminRepo.save(ent);
    }
    async approveAgent(agentId) {
        this.validateUUID(agentId, 'agent ID');
        const agent = await this.agentService.findOne(agentId);
        if (!agent)
            throw new common_1.NotFoundException('Agent not found');
        await this.agentService.update(agentId, {
            isApprovedByAdmin: true,
            kycStatus: agent_entity_1.AgentKycStatus.VERIFIED,
            registrationStatus: agent_entity_1.AgentRegistrationStatus.APPROVED,
        });
        return { success: true };
    }
    async approveVendorProfileChange(agentId) {
        this.validateUUID(agentId, 'agent ID');
        const agent = await this.agentRepo.findOne({
            where: { id: agentId },
            relations: ['user'],
        });
        if (!agent)
            throw new common_1.NotFoundException('Agent/Vendor not found');
        if (!agent.pendingProfileChange || agent.pendingProfileChange.status !== 'PENDING_ADMIN_APPROVAL') {
            throw new common_1.BadRequestException('No pending profile changes found for this vendor');
        }
        const { pendingFirstName, pendingLastName, pendingEmail } = agent.pendingProfileChange;
        if (agent.user) {
            if (pendingFirstName)
                agent.user.firstName = pendingFirstName;
            if (pendingLastName)
                agent.user.lastName = pendingLastName;
            if (pendingFirstName || pendingLastName) {
                agent.user.name = `${agent.user.firstName} ${agent.user.lastName}`.trim();
            }
            if (pendingEmail)
                agent.user.email = pendingEmail;
            await this.userRepo.save(agent.user);
        }
        agent.pendingProfileChange.status = 'APPROVED';
        agent.pendingProfileChange.approvedAt = new Date();
        await this.agentRepo.save(agent);
        return { success: true, message: 'Vendor name/email change approved successfully' };
    }
    async rejectVendorProfileChange(agentId, reason) {
        this.validateUUID(agentId, 'agent ID');
        const agent = await this.agentRepo.findOne({ where: { id: agentId } });
        if (!agent)
            throw new common_1.NotFoundException('Agent/Vendor not found');
        if (!agent.pendingProfileChange) {
            throw new common_1.BadRequestException('No pending profile changes found');
        }
        agent.pendingProfileChange.status = 'REJECTED';
        agent.pendingProfileChange.rejectedAt = new Date();
        agent.pendingProfileChange.rejectionReason = reason || 'Admin rejected the modification';
        await this.agentRepo.save(agent);
        return { success: true, message: 'Vendor profile change rejected', reason };
    }
    async rejectAgent(agentId, reason) {
        this.validateUUID(agentId, 'agent ID');
        const agent = await this.agentService.findOne(agentId);
        if (!agent)
            throw new common_1.NotFoundException('Agent not found');
        await this.agentService.update(agentId, {
            isApprovedByAdmin: false,
            kycStatus: agent_entity_1.AgentKycStatus.REJECTED,
            registrationStatus: agent_entity_1.AgentRegistrationStatus.REJECTED,
            rejectionReason: reason,
        });
        try {
            if (agent.user)
                await this.agentMailService.sendAgentApprovalNotification(agent.user, agent, false);
        }
        catch (e) { }
        return { success: true };
    }
    validateUUID(id, fieldName = 'ID') {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
            throw new common_1.BadRequestException(`Invalid ${fieldName} format. Must be a valid UUID.`);
        }
    }
    formatAgentSummary(agent) {
        const latestKyc = (agent.kycRecords ?? [])
            .slice()
            .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))[0];
        return {
            id: agent.id,
            userId: agent.userId,
            registrationStatus: agent.registrationStatus,
            kycStatus: agent.kycStatus,
            isApprovedByAdmin: agent.isApprovedByAdmin,
            approvedAt: agent.approvedAt,
            rejectionReason: agent.rejectionReason,
            createdAt: agent.createdAt,
            user: agent.user
                ? {
                    id: agent.user.id,
                    firstName: agent.user.firstName,
                    lastName: agent.user.lastName,
                    email: agent.user.email,
                    phoneNumber: agent.user.phoneNumber,
                }
                : null,
            profile: agent.profile
                ? {
                    preferredTitle: agent.profile.preferredTitle,
                    licenseNumber: agent.profile.licenseNumber,
                    yearsOfExperience: agent.profile.yearsOfExperience,
                    specialization: agent.profile.specialization,
                    portfolioLink: agent.profile.portfolioLink,
                    profilePicture: agent.profile.profilePicture,
                }
                : null,
            latestKyc: latestKyc
                ? {
                    id: latestKyc.id,
                    status: latestKyc.status,
                    idType: latestKyc.idType,
                    idNumber: latestKyc.idNumber,
                    bankName: latestKyc.bankName,
                    accountNumber: latestKyc.accountNumber,
                    accountHolderName: latestKyc.accountHolderName,
                    submittedAt: latestKyc.createdAt,
                }
                : null,
        };
    }
    formatAgentDetail(agent) {
        return {
            id: agent.id,
            vendorId: agent.vendorId || `VN${agent.id.slice(0, 4).toUpperCase()}`,
            userId: agent.userId,
            registrationStatus: agent.registrationStatus,
            kycStatus: agent.kycStatus,
            isApprovedByAdmin: agent.isApprovedByAdmin,
            approvedAt: agent.approvedAt,
            rejectionReason: agent.rejectionReason,
            businessName: agent.businessName,
            pendingProfileChange: agent.pendingProfileChange ?? null,
            createdAt: agent.createdAt,
            updatedAt: agent.updatedAt,
            user: agent.user
                ? {
                    id: agent.user.id,
                    firstName: agent.user.firstName,
                    lastName: agent.user.lastName,
                    email: agent.user.email,
                    phoneNumber: agent.user.phoneNumber,
                    profilePics: agent.user.profilePics,
                }
                : null,
            profile: agent.profile ?? null,
            bio: agent.bioRecord?.bio ?? null,
            kycRecords: (agent.kycRecords ?? [])
                .slice()
                .sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1))
                .map((k) => ({
                id: k.id,
                status: k.status,
                idType: k.idType,
                idNumber: k.idNumber,
                idDocument: k.idDocument,
                architectCert: k.architectCert,
                bankName: k.bankName,
                accountNumber: k.accountNumber,
                accountHolderName: k.accountHolderName,
                documents: k.documents,
                submittedAt: k.createdAt,
                updatedAt: k.updatedAt,
            })),
        };
    }
    async getAdminUsers(query) {
        const { page = 1, limit = 20, search, status, tab, userType } = query;
        const skip = (page - 1) * limit;
        const qb = this.userRepo
            .createQueryBuilder('user')
            .leftJoinAndMapOne('user.agent', agent_entity_1.Agent, 'agent', 'agent.userId = user.id')
            .leftJoinAndMapOne('user.admin', admin_entity_1.Admin, 'admin', 'admin.userId = user.id');
        const effectiveTab = tab || userType;
        if (effectiveTab === 'Customers' || effectiveTab === 'Customer') {
            qb.andWhere('agent.id IS NULL');
            qb.andWhere('admin.id IS NULL');
        }
        else if (effectiveTab === 'Agents' || effectiveTab === 'Agent') {
            qb.andWhere('agent.id IS NOT NULL');
            if (query.isApproved === 'true' || query.isApproved === true) {
                qb.andWhere("agent.registrationStatus = 'approved'");
            }
        }
        else if (effectiveTab === 'Staff') {
            qb.andWhere('admin.id IS NOT NULL');
            if (query.role && query.role !== 'All') {
                qb.andWhere('admin.role = :role', { role: query.role });
            }
        }
        if (status && status !== 'All') {
            if (status === 'Disabled') {
                qb.andWhere('user.isSuspended = :suspended', { suspended: true });
            }
            else if (status === 'Active') {
                qb.andWhere('user.isSuspended = :suspended AND user.isEmailVerified = :verified', { suspended: false, verified: true });
            }
            else if (status === 'Pending') {
                qb.andWhere('user.isSuspended = :suspended AND user.isEmailVerified = :verified', { suspended: false, verified: false });
            }
        }
        if (search) {
            qb.andWhere('(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.email ILIKE :search)', {
                search: `%${search}%`,
            });
        }
        qb.orderBy('user.createdAt', 'DESC').take(limit).skip(skip);
        const [users, total] = await qb.getManyAndCount();
        const mapStatus = (u) => u.isSuspended ? 'Disabled' : u.isEmailVerified ? 'Active' : 'Pending';
        const data = users.map((u) => {
            let userType = 'Customer';
            if (u.admin) {
                userType = u.admin.role || 'Admin';
            }
            else if (u.agent) {
                userType = 'Agent';
            }
            return {
                id: u.id,
                name: `${u.firstName} ${u.lastName}`,
                email: u.email,
                role: u.admin ? 'admin' : u.agent ? 'agent' : 'user',
                userType: userType,
                phoneNumber: u.phoneNumber,
                status: mapStatus(u),
                verification: u.isEmailVerified ? 'Verified' : 'Pending',
                lastLogin: u.lastLoginAttempt ?? u.updatedAt,
                profilePics: u.profilePics,
                createdAt: u.createdAt,
            };
        });
        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async getAdminUserDetail(userId) {
        this.validateUUID(userId, 'user ID');
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const { password, loginVerificationToken, ...safe } = user;
        return safe;
    }
    async suspendUser(userId) {
        this.validateUUID(userId, 'user ID');
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        user.isSuspended = true;
        await this.userRepo.save(user);
        return { success: true, message: 'User suspended' };
    }
    async activateUser(userId) {
        this.validateUUID(userId, 'user ID');
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        user.isSuspended = false;
        await this.userRepo.save(user);
        return { success: true, message: 'User activated' };
    }
    async getCommunicationStats() {
        const total = await this.conversationRepo.count();
        const archived = await this.conversationRepo.count({
            where: { isArchived: true },
        });
        const active = total - archived;
        const unread = await this.messageRepo.count({ where: { isRead: false } });
        return { total, active, archived, unreadMessages: unread };
    }
    async getConversations(query) {
        const { page = 1, limit = 20, search } = query;
        const skip = (page - 1) * limit;
        const qb = this.conversationRepo
            .createQueryBuilder('conv')
            .leftJoinAndSelect('conv.members', 'member')
            .leftJoinAndSelect('member.user', 'user')
            .leftJoinAndSelect('conv.lastMessage', 'lastMsg')
            .leftJoinAndSelect('lastMsg.author', 'lastMsgAuthor')
            .orderBy('conv.lastMessageAt', 'DESC')
            .take(limit)
            .skip(skip);
        if (search) {
            qb.andWhere('(conv.name ILIKE :s OR user.firstName ILIKE :s OR user.lastName ILIKE :s OR user.email ILIKE :s)', { s: `%${search}%` });
        }
        const [convs, total] = await qb.getManyAndCount();
        const data = convs.map((c) => {
            const memberUsers = c.members?.map((m) => m.user).filter(Boolean) || [];
            const memberNames = memberUsers
                .map((u) => `${u.firstName || ''} ${u.lastName || ''}`.trim())
                .filter(Boolean);
            const displayName = c.name ||
                (memberNames.length > 0 ? memberNames.join(', ') : 'Conversation');
            const authorName = c.lastMessage?.author
                ? `${c.lastMessage.author.firstName || ''} ${c.lastMessage.author.lastName || ''}`.trim()
                : null;
            const unreadTotal = c.members?.reduce((acc, m) => acc + (m.unreadCount || 0), 0) || 0;
            return {
                id: c.id,
                name: displayName,
                author: authorName,
                type: c.type || 'dm',
                isArchived: c.isArchived,
                lastMessage: c.lastMessage?.text ?? null,
                lastMessageAt: c.lastMessageAt || c.updatedAt || c.createdAt,
                memberCount: c.members?.length ?? 0,
                unreadCount: unreadTotal,
                members: memberUsers.map((u) => ({
                    id: u.id,
                    name: `${u.firstName || ''} ${u.lastName || ''}`.trim(),
                    email: u.email,
                    profilePics: u.profilePics,
                })),
            };
        });
        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async getConversationDetail(conversationId) {
        this.validateUUID(conversationId, 'conversation ID');
        const conv = await this.conversationRepo.findOne({
            where: { id: conversationId },
            relations: ['members', 'members.user', 'messages', 'messages.author'],
        });
        if (!conv)
            throw new common_1.NotFoundException('Conversation not found');
        return conv;
    }
    async escalateConversation(conversationId, reason) {
        this.validateUUID(conversationId, 'conversation ID');
        const conv = await this.conversationRepo.findOne({
            where: { id: conversationId },
        });
        if (!conv)
            throw new common_1.NotFoundException('Conversation not found');
        this.logger.log(`Conversation ${conversationId} escalated: ${reason}`);
        return {
            success: true,
            message: 'Conversation escalated to support team',
            conversationId,
            reason,
        };
    }
    async getAdminMessages(query) {
        return this.getConversations(query);
    }
    async getConversationMessages(conversationId) {
        this.validateUUID(conversationId, 'conversation ID');
        const conv = await this.conversationRepo.findOne({
            where: { id: conversationId },
            relations: ['members', 'members.user'],
        });
        if (!conv)
            throw new common_1.NotFoundException('Conversation not found');
        const messages = await this.messageRepo.find({
            where: { conversation: { id: conversationId } },
            relations: ['author'],
            order: { createdAt: 'ASC' },
        });
        return { conversation: conv, messages };
    }
    async adminSendMessage(conversationId, adminId, text, attachments) {
        const conv = await this.conversationRepo.findOne({
            where: { id: conversationId },
        });
        if (!conv)
            throw new common_1.NotFoundException('Conversation not found');
        const adminRecord = await this.adminRepo.findOne({
            where: { id: adminId },
            relations: ['user'],
        });
        if (!adminRecord)
            throw new common_1.NotFoundException('Admin not found');
        const msg = this.messageRepo.create({
            conversation: conv,
            author: adminRecord.user,
            text,
            attachments: attachments ?? [],
        });
        const saved = await this.messageRepo.save(msg);
        conv.lastMessageAt = new Date();
        conv.lastMessage = saved;
        await this.conversationRepo.save(conv);
        return saved;
    }
    async getFinancialStats() {
        const orders = await this.orderRepo.find({ where: { isPaid: true } });
        const totalRevenue = orders.reduce((s, o) => s + Number(o.grandTotal), 0);
        const orderCount = orders.length;
        const walletSummary = await this.walletService.getFinancialSummary();
        return {
            totalRevenue,
            customerPayments: totalRevenue,
            pendingPayouts: walletSummary.byStatusAmount.pending +
                walletSummary.byStatusAmount.approved +
                walletSummary.byStatusAmount.processing,
            completedPayouts: walletSummary.byStatusAmount.transferred,
            platformCommission: +(totalRevenue * 0.05).toFixed(2),
            totalOrders: orderCount,
            refundsIssued: 0,
        };
    }
    async getCustomerTransactions(query) {
        const { page = 1, limit = 20, search, status } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (status && status !== 'All') {
            if (status === 'Completed')
                where.isPaid = true;
            if (status === 'Pending')
                where.isPaid = false;
        }
        const [orders, total] = await this.orderRepo.findAndCount({
            where,
            relations: ['user', 'orderItems', 'orderItems.product', 'orderItems.product.agent', 'orderItems.product.agent.user'],
            order: { createdAt: 'DESC' },
            take: limit,
            skip,
        });
        const data = orders.map((o) => {
            const productNames = o.orderItems
                ?.map((item) => item.product?.title)
                .filter(Boolean)
                .join(', ') ||
                o.projectDsc ||
                'Marketplace Order';
            const productIds = o.orderItems
                ?.map((item) => item.product?.productId || (item.product?.id ? item.product.id.slice(0, 8).toUpperCase() : null))
                .filter(Boolean)
                .join(', ') || 'N/A';
            const vendorNames = o.orderItems
                ?.map((item) => {
                const agent = item.product?.agent;
                return agent?.businessName || (agent?.user ? `${agent.user.firstName} ${agent.user.lastName}` : null);
            })
                .filter(Boolean)
                .join(', ') || 'Mejarc Vendor';
            const transactionId = o.payStackPayment?.reference ||
                o.payStackPayment?.id ||
                `TXN-${o.id.slice(0, 8).toUpperCase()}`;
            const channel = o.payStackPayment?.channel;
            const formattedChannel = channel
                ? channel.charAt(0).toUpperCase() + channel.slice(1)
                : 'Card';
            return {
                id: o.id,
                orderId: `ORD-${o.id.slice(0, 8).toUpperCase()}`,
                productId: productIds,
                transactionId: transactionId,
                vendorName: vendorNames,
                customer: o.user ? `${o.user.firstName} ${o.user.lastName}` : 'Unknown',
                amount: o.grandTotal,
                method: o.paymentMethod || formattedChannel,
                status: o.isPaid ? 'Completed' : 'Pending',
                date: o.createdAt,
                project: productNames,
                category: 'Marketplace',
            };
        });
        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async getAgentPayouts(query) {
        const { page = 1, limit = 20 } = query;
        const skip = (page - 1) * limit;
        const withdrawalRequestRepo = this.marketProductRepo.manager.getRepository(withdrawal_request_entity_1.WithdrawalRequest);
        const [requests, total] = await withdrawalRequestRepo.findAndCount({
            relations: ['agent', 'agent.user', 'agent.profile'],
            order: { createdAt: 'DESC' },
            take: limit,
            skip,
        });
        const data = requests.map((r) => ({
            id: r.id,
            agent: r.agent?.user
                ? `${r.agent.user.firstName} ${r.agent.user.lastName}`
                : 'Unknown',
            avatar: r.agent?.user?.profilePics || r.agent?.profile?.profilePicture || null,
            project: r.description || 'Withdrawal Request',
            amount: Number(r.amount),
            status: r.status,
            accountDetails: r.accountDetails,
            autoProcess: r.autoProcess,
            adminNotes: r.adminNotes,
            paystackReference: r.paystackReference,
            date: r.createdAt,
        }));
        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async getDisputes(query) {
        return {
            data: [],
            meta: {
                total: 0,
                page: 1,
                limit: 20,
                note: 'Dispute tracking coming soon',
            },
        };
    }
    async getRefunds(query) {
        return {
            data: [],
            meta: {
                total: 0,
                page: 1,
                limit: 20,
                note: 'Refund tracking coming soon',
            },
        };
    }
    async releasePayout(payoutId, notes) {
        return { success: true, message: `Payout ${payoutId} released`, notes };
    }
    async resolveDispute(disputeId, resolution, refundTo) {
        return {
            success: true,
            message: `Dispute ${disputeId} resolved`,
            resolution,
            refundTo,
        };
    }
    async approveRefund(refundId, notes) {
        return { success: true, message: `Refund ${refundId} approved`, notes };
    }
    async getMarketplaceStats() {
        const total = await this.marketProductRepo.count();
        const approved = await this.marketProductRepo.count({
            where: { status: marketproduct_entity_1.MarketProductStatus.APPROVED },
        });
        const pending = await this.marketProductRepo.count({
            where: { status: marketproduct_entity_1.MarketProductStatus.PENDING_REVIEW },
        });
        const rejected = await this.marketProductRepo.count({
            where: { status: marketproduct_entity_1.MarketProductStatus.REJECTED },
        });
        return { total, approved, pending, rejected };
    }
    async getMarketplaceListings(query) {
        const { page = 1, limit = 20, search, status, type } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (status && status !== 'All') {
            const map = {
                Approved: marketproduct_entity_1.MarketProductStatus.APPROVED,
                'Pending Approval': marketproduct_entity_1.MarketProductStatus.PENDING_REVIEW,
                Rejected: marketproduct_entity_1.MarketProductStatus.REJECTED,
            };
            if (map[status])
                where.status = map[status];
        }
        if (type) {
            if (type === 'Building Plan') {
                where.category = 'Building Plan';
            }
            else if (type === 'Product Design') {
                where.category = (0, database_module_2.In)(['Product Design', 'Building Guide']);
            }
            else {
                where.category = type;
            }
        }
        const [products, total] = await this.marketProductRepo.findAndCount({
            where,
            relations: ['agent', 'agent.user', 'agent.profile'],
            order: { createdAt: 'DESC' },
            take: limit,
            skip,
        });
        const data = products.map((p) => ({
            id: p.id,
            productId: p.productId || (p.id ? `PRD-${p.id.slice(0, 8).toUpperCase()}` : 'N/A'),
            title: p.title,
            category: p.category,
            planType: p.planType,
            price: p.price,
            status: p.status,
            agent: p.agent?.user
                ? `${p.agent.user.firstName} ${p.agent.user.lastName}`
                : p.agent?.businessName || 'Unknown',
            vendorId: p.agent?.vendorId || (p.agent?.id ? `VN${p.agent.id.slice(0, 4).toUpperCase()}` : 'N/A'),
            vendorName: p.agent?.businessName || (p.agent?.user ? `${p.agent.user.firstName} ${p.agent.user.lastName}` : 'N/A'),
            agentId: p.agentId,
            agentAvatar: p.agent?.user?.profilePics || p.agent?.profile?.profilePicture || null,
            createdAt: p.createdAt,
        }));
        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async getMarketplaceListing(listingId) {
        this.validateUUID(listingId, 'listing ID');
        const product = await this.marketProductRepo.findOne({
            where: { id: listingId },
            relations: ['agent', 'agent.user', 'ratings'],
        });
        if (!product)
            throw new common_1.NotFoundException('Listing not found');
        return product;
    }
    async approveMarketplaceListing(listingId) {
        this.validateUUID(listingId, 'listing ID');
        const product = await this.marketProductRepo.findOne({
            where: { id: listingId },
        });
        if (!product)
            throw new common_1.NotFoundException('Listing not found');
        product.status = marketproduct_entity_1.MarketProductStatus.APPROVED;
        await this.marketProductRepo.save(product);
        return { success: true, message: 'Listing approved' };
    }
    async rejectMarketplaceListing(listingId, reason) {
        this.validateUUID(listingId, 'listing ID');
        const product = await this.marketProductRepo.findOne({
            where: { id: listingId },
        });
        if (!product)
            throw new common_1.NotFoundException('Listing not found');
        product.status = marketproduct_entity_1.MarketProductStatus.REJECTED;
        await this.marketProductRepo.save(product);
        return { success: true, message: 'Listing rejected', reason };
    }
    async requestMarketplaceChange(listingId, feedback) {
        this.validateUUID(listingId, 'listing ID');
        const product = await this.marketProductRepo.findOne({
            where: { id: listingId },
        });
        if (!product)
            throw new common_1.NotFoundException('Listing not found');
        this.logger.log(`Change requested for listing ${listingId}: ${feedback}`);
        return { success: true, message: 'Change request sent to agent', feedback };
    }
    async getProjectStats() {
        const total = await this.orderRepo.count();
        const paid = await this.orderRepo.count({ where: { isPaid: true } });
        const unpaid = total - paid;
        return {
            totalProjects: total,
            ongoing: paid,
            completed: 0,
            disputed: 0,
            cancelled: unpaid,
        };
    }
    async getCustomerProjects(query) {
        const { page = 1, limit = 20, search, status } = query;
        const skip = (page - 1) * limit;
        const [orders, total] = await this.orderRepo.findAndCount({
            relations: ['user'],
            order: { createdAt: 'DESC' },
            take: limit,
            skip,
        });
        const data = orders.map((o) => ({
            projectId: o.id.slice(0, 8).toUpperCase(),
            orderId: o.id,
            customerName: o.user
                ? `${o.user.firstName} ${o.user.lastName}`
                : 'Unknown',
            planType: o.projectDsc ?? 'N/A',
            purchaseType: o.paymentMethod ?? 'N/A',
            budget: o.grandTotal,
            status: o.isPaid ? 'Ongoing' : 'Pending',
            startDate: o.createdAt,
            deadline: null,
            agentAssigned: null,
        }));
        return {
            data,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }
    async getAgentPerformance(query) {
        const agents = await this.agentRepo.find({
            relations: ['user', 'wallet'],
            take: 50,
        });
        const withdrawalRepo = this.marketProductRepo.manager.getRepository(withdrawal_request_entity_1.WithdrawalRequest);
        const data = await Promise.all(agents.map(async (a) => {
            const vendorId = a.vendorId || (a.id ? `VN${a.id.slice(0, 4).toUpperCase()}` : 'N/A');
            const earningsNum = a.wallet ? Number(a.wallet.lifetimeEarnings || a.wallet.balance || 0) : 0;
            const transferredWithdrawals = await withdrawalRepo.find({
                where: { agentId: a.id, status: (0, database_module_2.In)(['transferred', 'approved']) },
            });
            const totalPayoutNum = transferredWithdrawals.reduce((sum, w) => sum + Number(w.amount || 0), 0);
            const outstandingBalance = Math.max(0, earningsNum - totalPayoutNum);
            const productsCount = await this.marketProductRepo.count({
                where: { agentId: a.id, status: marketproduct_entity_1.MarketProductStatus.APPROVED },
            });
            return {
                id: a.id,
                vendorId,
                name: a.user ? `${a.user.firstName} ${a.user.lastName}` : a.businessName || 'Agent',
                businessName: a.businessName || 'N/A',
                handled: productsCount,
                completed: productsCount,
                ongoing: 0,
                cancelled: 0,
                disputed: 0,
                earnings: `₦${earningsNum.toLocaleString()}`,
                rawEarnings: earningsNum,
                totalPayout: `₦${totalPayoutNum.toLocaleString()}`,
                rawTotalPayout: totalPayoutNum,
                balanceOwed: `₦${outstandingBalance.toLocaleString()}`,
                rating: '5.0/5',
            };
        }));
        return { data, meta: { total: data.length } };
    }
    async getCustomProjectSubmissions(query) {
        const products = await this.marketProductRepo.find({
            where: { status: marketproduct_entity_1.MarketProductStatus.PENDING_REVIEW },
            relations: ['agent', 'agent.user'],
            order: { createdAt: 'DESC' },
        });
        const data = products.map((p) => ({
            submissionId: p.id.slice(0, 8).toUpperCase(),
            productId: p.id,
            agentName: p.agent?.user
                ? `${p.agent.user.firstName} ${p.agent.user.lastName}`
                : 'Unknown',
            projectTitle: p.title,
            planType: p.planType,
            projectValue: p.price,
            submissionDate: p.createdAt,
            status: 'Pending Approval',
        }));
        return { data, meta: { total: data.length } };
    }
    async getProjectDetail(projectId) {
        this.validateUUID(projectId, 'project ID');
        const order = await this.orderRepo.findOne({
            where: { id: projectId },
            relations: ['user'],
        });
        if (!order)
            throw new common_1.NotFoundException('Project not found');
        return order;
    }
    async assignAgentToProject(projectId, agentId) {
        this.validateUUID(projectId, 'project ID');
        this.validateUUID(agentId, 'agent ID');
        const order = await this.orderRepo.findOne({ where: { id: projectId } });
        if (!order)
            throw new common_1.NotFoundException('Project not found');
        const agent = await this.agentRepo.findOne({ where: { id: agentId } });
        if (!agent)
            throw new common_1.NotFoundException('Agent not found');
        return {
            success: true,
            message: `Agent ${agentId} assigned to project ${projectId}`,
        };
    }
    async approveCustomProject(submissionId) {
        this.validateUUID(submissionId, 'submission ID');
        const product = await this.marketProductRepo.findOne({
            where: { id: submissionId },
        });
        if (!product)
            throw new common_1.NotFoundException('Submission not found');
        product.status = marketproduct_entity_1.MarketProductStatus.APPROVED;
        await this.marketProductRepo.save(product);
        return { success: true, message: 'Custom project approved' };
    }
    async rejectCustomProject(submissionId, reason) {
        this.validateUUID(submissionId, 'submission ID');
        const product = await this.marketProductRepo.findOne({
            where: { id: submissionId },
        });
        if (!product)
            throw new common_1.NotFoundException('Submission not found');
        product.status = marketproduct_entity_1.MarketProductStatus.REJECTED;
        await this.marketProductRepo.save(product);
        return { success: true, message: 'Custom project rejected', reason };
    }
    async getReportsSummary() {
        const paidOrders = await this.orderRepo.find({ where: { isPaid: true } });
        const totalRevenue = paidOrders.reduce((s, o) => s + Number(o.grandTotal || 0), 0);
        const totalUsers = await this.userRepo.count();
        const totalAgents = await this.agentRepo.count();
        const totalProducts = await this.marketProductRepo.count();
        const totalOrders = await this.orderRepo.count();
        let completedPayouts = 0;
        try {
            const walletSummary = await this.walletService.getFinancialSummary();
            completedPayouts = Number(walletSummary?.byStatusAmount?.transferred || 0);
        }
        catch (err) {
            this.logger.warn('Could not load wallet financial summary for reports', err);
        }
        const platformCommission = +(totalRevenue * 0.05).toFixed(2);
        return {
            totalRevenue,
            customerPayments: totalRevenue,
            agentPayouts: completedPayouts,
            platformCommission,
            totalUsers,
            totalAgents,
            totalProducts,
            totalOrders,
        };
    }
    async getSystemHealth() {
        let dbStatus = 'Connected';
        let dbLatencyMs = 0;
        let isDbHealthy = true;
        try {
            const start = Date.now();
            await this.userRepo.query('SELECT 1');
            dbLatencyMs = Date.now() - start;
            dbStatus = 'Connected';
            isDbHealthy = true;
        }
        catch (err) {
            this.logger.error('Database health check failed', err);
            dbStatus = 'Disconnected';
            isDbHealthy = false;
        }
        const uptimeSeconds = Math.floor(process.uptime());
        const days = Math.floor(uptimeSeconds / (3600 * 24));
        const hours = Math.floor((uptimeSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        const uptimeFormatted = days > 0 ? `${days}d ${hours}h ${minutes}m` : `${hours}h ${minutes}m`;
        const memUsage = process.memoryUsage();
        const heapUsedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
        const heapTotalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
        const rssMB = Math.round(memUsage.rss / 1024 / 1024);
        const healthScore = isDbHealthy ? (dbLatencyMs < 200 ? 100 : 85) : 0;
        const apiStatus = isDbHealthy ? 'Healthy' : 'Degraded';
        return {
            status: isDbHealthy ? 'OK' : 'DEGRADED',
            apiStatus,
            uptime: uptimeFormatted,
            uptimePercentage: '99.9%',
            uptimeSeconds,
            database: {
                status: dbStatus,
                connected: isDbHealthy,
                latencyMs: dbLatencyMs,
                latency: `${dbLatencyMs}ms`,
                type: 'PostgreSQL',
            },
            dbLoad: `${dbLatencyMs}ms (${dbStatus})`,
            errors: '0',
            healthScore,
            system: {
                nodeVersion: process.version,
                platform: process.platform,
                memory: {
                    heapUsedMB,
                    heapTotalMB,
                    rssMB,
                },
            },
            timestamp: new Date().toISOString(),
        };
    }
    async getProjectPerformance() {
        const totalOrders = await this.orderRepo.count();
        const completedOrders = await this.orderRepo.count({
            where: { isPaid: true },
        });
        const inProgressOrders = totalOrders - completedOrders;
        const completionRate = totalOrders > 0 ? +((completedOrders / totalOrders) * 100).toFixed(1) : 0;
        const totalAgents = await this.agentRepo.count();
        const approvedAgents = await this.agentRepo.count({
            where: { registrationStatus: agent_entity_1.AgentRegistrationStatus.APPROVED },
        });
        const agentApprovalRate = totalAgents > 0 ? +((approvedAgents / totalAgents) * 100).toFixed(1) : 0;
        const totalProducts = await this.marketProductRepo.count();
        const approvedProducts = await this.marketProductRepo.count({
            where: { status: marketproduct_entity_1.MarketProductStatus.APPROVED },
        });
        const productApprovalRate = totalProducts > 0
            ? +((approvedProducts / totalProducts) * 100).toFixed(1)
            : 0;
        const totalUsers = await this.userRepo.count();
        const verifiedUsers = await this.userRepo.count({
            where: { isEmailVerified: true },
        });
        const userVerificationRate = totalUsers > 0 ? +((verifiedUsers / totalUsers) * 100).toFixed(1) : 0;
        return {
            total: totalOrders,
            completed: completedOrders,
            inProgress: inProgressOrders,
            disputed: 0,
            cancelled: 0,
            completionRate,
            totalOrders,
            completedOrders,
            inProgressOrders,
            totalAgents,
            approvedAgents,
            agentApprovalRate,
            totalProducts,
            approvedProducts,
            productApprovalRate,
            totalUsers,
            verifiedUsers,
            userVerificationRate,
        };
    }
    async getRevenueChart() {
        const now = new Date();
        const months = Array.from({ length: 6 }, (_, i) => {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            return {
                label: d.toLocaleString('default', { month: 'short' }),
                year: d.getFullYear(),
                month: d.getMonth(),
            };
        }).reverse();
        const data = await Promise.all(months.map(async (m) => {
            const start = new Date(m.year, m.month, 1, 0, 0, 0, 0);
            const end = new Date(m.year, m.month + 1, 0, 23, 59, 59, 999);
            const orders = await this.orderRepo.find({
                where: { isPaid: true, createdAt: (0, database_module_2.Between)(start, end) },
            });
            const revenue = orders.reduce((s, o) => s + Number(o.grandTotal || 0), 0);
            return { month: m.label, revenue, orderCount: orders.length };
        }));
        return { data };
    }
    async getTopAgents() {
        const agents = await this.agentRepo.find({
            relations: ['user', 'profile', 'wallet'],
            take: 10,
            order: { createdAt: 'DESC' },
        });
        const data = await Promise.all(agents.map(async (a) => {
            const productsCount = await this.marketProductRepo.count({
                where: { agentId: a.id, status: marketproduct_entity_1.MarketProductStatus.APPROVED },
            });
            const products = await this.marketProductRepo.find({
                where: { agentId: a.id },
            });
            const totalRating = products.reduce((acc, p) => acc + Number(p.averageRating || 0), 0);
            const avgRating = products.length > 0 ? +(totalRating / products.length).toFixed(1) : 0;
            const totalProducts = products.length;
            const completionRate = totalProducts > 0
                ? `${Math.round((productsCount / totalProducts) * 100)}%`
                : productsCount > 0
                    ? '100%'
                    : '0%';
            const agentName = a.user
                ? `${a.user.firstName || ''} ${a.user.lastName || ''}`.trim()
                : 'Agent';
            return {
                id: a.id,
                name: agentName || 'Agent',
                email: a.user?.email || null,
                avatar: a.user?.profilePics || a.profile?.profilePicture || null,
                rating: avgRating,
                projectsCompleted: productsCount,
                earnings: a.wallet
                    ? Number(a.wallet.lifetimeEarnings || a.wallet.balance || 0)
                    : 0,
                completionRate,
            };
        }));
        data.sort((x, y) => y.earnings - x.earnings || y.rating - x.rating);
        return { data };
    }
    async getCustomerActivity() {
        const recent = await this.orderRepo.find({
            relations: ['user'],
            order: { createdAt: 'DESC' },
            take: 20,
        });
        const data = recent.map((o) => {
            const customerName = o.user
                ? `${o.user.firstName || ''} ${o.user.lastName || ''}`.trim()
                : o.billingInfo?.firstName
                    ? `${o.billingInfo.firstName || ''} ${o.billingInfo.lastName || ''}`.trim()
                    : 'Customer';
            return {
                id: o.id,
                userId: o.userId,
                customer: customerName || 'Customer',
                email: o.user?.email || o.billingInfo?.email || '',
                action: o.isPaid ? 'Payment completed' : 'Order placed',
                status: o.isPaid ? 'Paid' : 'Pending',
                amount: Number(o.grandTotal || 0),
                date: o.createdAt,
            };
        });
        return { data };
    }
    async getRolesStats() {
        const totalRoles = this.rolesStore.length;
        const activeStaff = await this.adminRepo.count({
            where: { isActive: true },
        });
        return {
            totalRoles,
            activeStaff,
            departmentsCovered: totalRoles,
            customRolesCreated: 2,
        };
    }
    async getAllRoles() {
        return { data: this.rolesStore, total: this.rolesStore.length };
    }
    async createRole(dto) {
        const newRole = {
            id: Date.now().toString(),
            ...dto,
            users: 0,
            createdAt: new Date(),
        };
        this.rolesStore.push(newRole);
        return { success: true, role: newRole };
    }
    async updateRole(roleId, dto) {
        const idx = this.rolesStore.findIndex((r) => r.id === roleId);
        if (idx < 0)
            throw new common_1.NotFoundException('Role not found');
        this.rolesStore[idx] = { ...this.rolesStore[idx], ...dto };
        return { success: true, role: this.rolesStore[idx] };
    }
    async deleteRole(roleId) {
        const idx = this.rolesStore.findIndex((r) => r.id === roleId);
        if (idx < 0)
            throw new common_1.NotFoundException('Role not found');
        this.rolesStore.splice(idx, 1);
        return { success: true, message: 'Role deleted' };
    }
    async getStaffList() {
        const admins = await this.adminRepo.find({ relations: ['user'] });
        const data = admins.map((a) => ({
            id: a.id,
            userId: a.userId,
            name: a.user ? `${a.user.firstName} ${a.user.lastName}` : 'Unknown',
            email: a.user?.email,
            role: a.role ?? 'admin',
            isActive: a.isActive,
            createdAt: a.createdAt,
        }));
        return { data, total: data.length };
    }
    async assignRoleToStaff(userId, roleId) {
        const admin = await this.adminRepo.findOne({ where: { userId } });
        if (!admin)
            throw new common_1.NotFoundException('Staff member not found');
        const role = this.rolesStore.find((r) => r.id === roleId);
        if (!role)
            throw new common_1.NotFoundException('Role not found');
        admin.role = role.name;
        await this.adminRepo.save(admin);
        return {
            success: true,
            message: `Role "${role.name}" assigned to user ${userId}`,
        };
    }
    async getPermissionMatrix() {
        const permissions = [
            'View Users',
            'Edit Users',
            'Assign Agents',
            'Manage Projects',
            'Approve Refunds',
            'Process Payouts',
            'Access Reports',
        ];
        const roles = [
            'Super Admin',
            'Project Manager',
            'Finance Manager',
            'Support Manager',
        ];
        const matrix = {
            'Super Admin': [1, 1, 1, 1, 1, 1, 1],
            'Project Manager': [1, 1, 1, 1, 0, 0, 1],
            'Finance Manager': [1, 0, 0, 0, 1, 1, 1],
            'Support Manager': [1, 0, 0, 0, 1, 0, 1],
        };
        return { permissions, roles, matrix };
    }
    async getAdminProfile(adminId) {
        const admin = await this.adminRepo.findOne({
            where: { id: adminId },
            relations: ['user', 'user.address'],
        });
        if (!admin)
            throw new common_1.NotFoundException('Admin not found');
        const { password, loginVerificationToken, ...safeUser } = admin.user;
        return { ...safeUser, adminId: admin.id, adminRole: admin.role };
    }
    async updateAdminProfile(adminId, dto) {
        const admin = await this.adminRepo.findOne({
            where: { id: adminId },
            relations: ['user', 'user.address'],
        });
        if (!admin)
            throw new common_1.NotFoundException('Admin not found');
        const user = admin.user;
        if (dto.firstName)
            user.firstName = dto.firstName;
        if (dto.lastName)
            user.lastName = dto.lastName;
        if (dto.email)
            user.email = dto.email;
        if (dto.phoneNumber !== undefined)
            user.phoneNumber = dto.phoneNumber;
        if (dto.profilePics)
            user.profilePics = dto.profilePics;
        if (dto.street || dto.city || dto.state || dto.country || dto.address) {
            if (!user.address) {
                user.address = this.userRepo.manager.create(user_adress_entity_1.UserAddress, {
                    street: dto.street || dto.address || '',
                    city: dto.city || '',
                    state: dto.state || '',
                    country: dto.country || '',
                });
            }
            else {
                if (dto.street || dto.address)
                    user.address.street = dto.street || dto.address;
                if (dto.city)
                    user.address.city = dto.city;
                if (dto.state)
                    user.address.state = dto.state;
                if (dto.country)
                    user.address.country = dto.country;
            }
        }
        await this.userRepo.save(user);
        return {
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                profilePics: user.profilePics,
                address: user.address,
            },
        };
    }
    async changeAdminPassword(adminId, currentPassword, newPassword) {
        const admin = await this.adminRepo.findOne({
            where: { id: adminId },
            relations: ['user'],
        });
        if (!admin)
            throw new common_1.NotFoundException('Admin not found');
        const user = admin.user;
        const valid = await bcrypt.compare(currentPassword, user.password ?? '');
        if (!valid)
            throw new common_1.UnauthorizedException('Current password is incorrect');
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await this.userRepo.save(user);
        return { success: true, message: 'Password changed successfully' };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = AdminService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, database_module_1.InjectRepository)(admin_entity_1.Admin)),
    __param(1, (0, database_module_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, database_module_1.InjectRepository)(agent_entity_1.Agent)),
    __param(3, (0, database_module_1.InjectRepository)(order_entity_1.Order)),
    __param(4, (0, database_module_1.InjectRepository)(marketproduct_entity_1.MarketProduct)),
    __param(5, (0, database_module_1.InjectRepository)(conversation_entity_1.Conversation)),
    __param(6, (0, database_module_1.InjectRepository)(message_entity_1.Message)),
    __param(11, (0, common_2.Inject)((0, common_2.forwardRef)(() => wallet_service_1.WalletService))),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, agent_service_1.AgentService,
        mail_service_1.AgentMailService,
        mail_service_2.MailService,
        jwt_1.JwtService,
        wallet_service_1.WalletService])
], AdminService);
//# sourceMappingURL=admin.service.js.map