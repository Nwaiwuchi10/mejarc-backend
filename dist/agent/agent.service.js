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
var AgentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentService = void 0;
const common_1 = require("@nestjs/common");
const marketproduct_entity_1 = require("../marketproduct/entities/marketproduct.entity");
const database_module_1 = require("../database/database.module");
const database_module_2 = require("../database/database.module");
const agent_entity_1 = require("./entities/agent.entity");
const agent_profile_entity_1 = require("./entities/agent-profile.entity");
const agent_bio_entity_1 = require("./entities/agent-bio.entity");
const agent_kyc_entity_1 = require("./entities/agent-kyc.entity");
const wallet_entity_1 = require("../wallet/entities/wallet.entity");
const user_entity_1 = require("../user/entities/user.entity");
const admin_entity_1 = require("../admin/entities/admin.entity");
const uverify_provider_1 = require("./provider/uverify.provider");
const mail_service_1 = require("./service/mail.service");
const notification_service_1 = require("../notification/notification.service");
const notification_entity_1 = require("../notification/entities/notification.entity");
let AgentService = AgentService_1 = class AgentService {
    constructor(agentRepo, profileRepo, bioRepo, kycRepo, userRepo, adminRepo, productRepo, kycProvider, mailService, notificationService) {
        this.agentRepo = agentRepo;
        this.profileRepo = profileRepo;
        this.bioRepo = bioRepo;
        this.kycRepo = kycRepo;
        this.userRepo = userRepo;
        this.adminRepo = adminRepo;
        this.productRepo = productRepo;
        this.kycProvider = kycProvider;
        this.mailService = mailService;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(AgentService_1.name);
    }
    async initializeAgent(userId) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const existingAgent = await this.agentRepo.findOne({ where: { userId } });
        if (existingAgent) {
            throw new common_1.ConflictException('Agent profile already exists for this user');
        }
        const wallet = new wallet_entity_1.Wallet();
        const agent = this.agentRepo.create({
            user,
            userId,
            registrationStatus: agent_entity_1.AgentRegistrationStatus.PROFILE_PENDING,
            wallet,
        });
        return this.agentRepo.save(agent);
    }
    async submitProfile(userId, profileDto, file) {
        await this.kycRepo
            .createQueryBuilder()
            .delete()
            .from(agent_kyc_entity_1.AgentKyc)
            .where('"agentId" IS NULL')
            .execute();
        const agent = await this.agentRepo.findOne({
            where: { userId },
            relations: ['user'],
        });
        if (agent && !agent.id) {
            throw new common_1.BadRequestException('Invalid agent record (missing id)');
        }
        if (!agent) {
            throw new common_1.NotFoundException('Agent profile not found. Please initialize first.');
        }
        if (!profileDto.yearsOfExperience ||
            !profileDto.preferredTitle ||
            !profileDto.specialization) {
            throw new common_1.BadRequestException('yearsOfExperience, preferredTitle, and specialization are required');
        }
        if (agent_profile_entity_1.TITLES_REQUIRING_LICENSE.includes(profileDto.preferredTitle) &&
            !profileDto.licenseNumber) {
            throw new common_1.BadRequestException(`licenseNumber is required for ${profileDto.preferredTitle}`);
        }
        let profile = await this.profileRepo.findOne({
            where: { agentId: agent.id },
        });
        if (!profile) {
            profile = this.profileRepo.create({ agent, agentId: agent.id });
        }
        profile.yearsOfExperience = profileDto.yearsOfExperience;
        profile.preferredTitle = profileDto.preferredTitle;
        profile.licenseNumber = profileDto.licenseNumber ?? undefined;
        profile.specialization = profileDto.specialization;
        profile.portfolioLink = profileDto.portfolioLink;
        profile.phoneNumber = profileDto.phoneNumber;
        profile.location = profileDto.location;
        profile.responseTime = profileDto.responseTime;
        profile.completedProjectsCount = profileDto.completedProjectsCount ?? 0;
        if (file) {
            const uploadedFile = file;
            if (!uploadedFile.location) {
                throw new common_1.BadRequestException('File upload failed: location missing');
            }
            profile.profilePicture = uploadedFile.location;
        }
        else if (profileDto.profilePicture) {
            profile.profilePicture = profileDto.profilePicture;
        }
        await this.profileRepo.save(profile);
        if (profileDto.phoneNumber) {
            agent.user.phoneNumber = profileDto.phoneNumber;
            await this.userRepo.save(agent.user);
        }
        agent.registrationStatus = agent_entity_1.AgentRegistrationStatus.BIO_PENDING;
        await this.agentRepo.update(agent.id, {
            registrationStatus: agent.registrationStatus,
        });
        return this.agentRepo.findOne({
            where: { id: agent.id },
            relations: ['user'],
        });
    }
    async submitBio(agentId, bioDto) {
        const agent = await this.agentRepo.findOne({ where: { id: agentId } });
        if (agent && !agent.id) {
            throw new common_1.BadRequestException('Invalid agent record (missing id)');
        }
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        if (agent.registrationStatus === agent_entity_1.AgentRegistrationStatus.APPROVED) {
            throw new common_1.BadRequestException('Cannot update approved agent profile');
        }
        let bio = await this.bioRepo.findOne({ where: { agentId: agent.id } });
        if (!bio) {
            bio = this.bioRepo.create({ agent, agentId: agent.id, bio: bioDto.bio });
        }
        else {
            bio.bio = bioDto.bio;
        }
        await this.bioRepo.save(bio);
        agent.registrationStatus = agent_entity_1.AgentRegistrationStatus.KYC_PENDING;
        await this.agentRepo.update(agent.id, {
            registrationStatus: agent.registrationStatus,
        });
        return this.agentRepo.findOne({
            where: { id: agent.id },
            relations: ['user'],
        });
    }
    async submitKyc(agentId, kycDto, files) {
        const agent = await this.agentRepo.findOne({ where: { id: agentId } });
        if (agent && !agent.id) {
            throw new common_1.BadRequestException('Invalid agent record (missing id)');
        }
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        if (agent.registrationStatus === agent_entity_1.AgentRegistrationStatus.APPROVED) {
            throw new common_1.BadRequestException('Cannot update approved agent profile');
        }
        if (!kycDto.idType || !kycDto.idNumber) {
            throw new common_1.BadRequestException('ID type and number are required');
        }
        if (!kycDto.bankName ||
            !kycDto.accountNumber ||
            !kycDto.accountHolderName) {
            throw new common_1.BadRequestException('Bank details are required');
        }
        let idDocumentUrl;
        let architectCertUrl;
        await this.kycRepo
            .createQueryBuilder()
            .delete()
            .from(agent_kyc_entity_1.AgentKyc)
            .where('"agentId" IS NULL')
            .execute();
        if (files?.idDocument && files.idDocument.length > 0) {
            const uploadedFile = files.idDocument[0];
            if (!uploadedFile.location) {
                throw new common_1.BadRequestException('ID Document upload failed: location missing');
            }
            idDocumentUrl = uploadedFile.location;
        }
        else if (kycDto.idDocument) {
            idDocumentUrl = kycDto.idDocument;
        }
        if (files?.architectCert && files.architectCert.length > 0) {
            const uploadedFile = files.architectCert[0];
            if (!uploadedFile.location) {
                throw new common_1.BadRequestException('Architect Certificate upload failed: location missing');
            }
            architectCertUrl = uploadedFile.location;
        }
        else if (kycDto.architectCert) {
            architectCertUrl = kycDto.architectCert;
        }
        let kyc = await this.kycRepo.findOne({
            where: { agentId: agent.id },
            order: { createdAt: 'DESC' },
        });
        if (kyc) {
            kyc.agent = agent;
            kyc.agentId = agent.id;
            kyc.idType = kycDto.idType;
            kyc.idNumber = kycDto.idNumber;
            kyc.idDocument = idDocumentUrl;
            kyc.architectCert = architectCertUrl;
            kyc.bankName = kycDto.bankName;
            kyc.accountNumber = kycDto.accountNumber;
            kyc.accountHolderName = kycDto.accountHolderName;
            kyc.documents = [];
            kyc.status = 'PENDING';
        }
        else {
            kyc = this.kycRepo.create({
                agent,
                agentId: agent.id,
                idType: kycDto.idType,
                idNumber: kycDto.idNumber,
                idDocument: idDocumentUrl,
                architectCert: architectCertUrl,
                bankName: kycDto.bankName,
                accountNumber: kycDto.accountNumber,
                accountHolderName: kycDto.accountHolderName,
                documents: [],
                status: 'PENDING',
            });
        }
        kyc.agentId = agent.id;
        await this.kycRepo.save(kyc);
        agent.registrationStatus = agent_entity_1.AgentRegistrationStatus.AWAITING_APPROVAL;
        agent.kycStatus = agent_entity_1.AgentKycStatus.PENDING;
        await this.agentRepo.update(agent.id, {
            registrationStatus: agent.registrationStatus,
            kycStatus: agent.kycStatus,
        });
        const savedAgent = await this.agentRepo.findOne({
            where: { id: agent.id },
            relations: ['user'],
        });
        if (!savedAgent) {
            throw new common_1.BadRequestException('Failed to load agent after KYC save');
        }
        const agentWithUser = await this.agentRepo.findOne({
            where: { id: savedAgent.id },
            relations: ['user'],
        });
        try {
            if (agentWithUser && agentWithUser.user) {
                await this.mailService.sendAgentRegistrationSubmittedNotification(agentWithUser.user, agentWithUser);
            }
            else {
                this.logger.warn('Agent user relation not found for registration notification');
            }
        }
        catch (error) {
            this.logger.warn('Failed to send registration submitted email', error);
        }
        try {
            const admins = await this.adminRepo.find({ relations: ['user'] });
            for (const admin of admins) {
                if (admin.user) {
                    await this.mailService.sendKycUploadedNotification(admin.user, savedAgent);
                }
            }
        }
        catch (error) {
            this.logger.warn('Failed to notify admins about KYC submission', error);
        }
        try {
            const latestKyc = await this.kycRepo.findOne({
                where: { agentId: agent.id },
                order: { createdAt: 'DESC' },
            });
            const documents = [];
            if (latestKyc?.idDocument) {
                documents.push({
                    key: 'idDocument',
                    url: latestKyc.idDocument,
                    name: 'ID Document',
                });
            }
            if (latestKyc?.architectCert) {
                documents.push({
                    key: 'architectCert',
                    url: latestKyc.architectCert,
                    name: 'Architect Certificate',
                });
            }
            if (documents.length > 0) {
                const verificationResult = await this.kycProvider.verifyDocuments(documents);
                if (verificationResult.success) {
                    savedAgent.kycStatus = agent_entity_1.AgentKycStatus.VERIFIED;
                    if (latestKyc) {
                        latestKyc.status = 'VERIFIED';
                        await this.kycRepo.save(latestKyc);
                    }
                }
                else {
                    savedAgent.kycStatus = agent_entity_1.AgentKycStatus.PENDING;
                }
                await this.agentRepo.save(savedAgent);
            }
        }
        catch (error) {
            this.logger.warn('KYC provider verification failed', error);
        }
        return savedAgent;
    }
    async approveAgent(agentId, adminId) {
        const agent = await this.agentRepo.findOne({
            where: { id: agentId },
            relations: ['user'],
        });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        agent.registrationStatus = agent_entity_1.AgentRegistrationStatus.APPROVED;
        agent.isApprovedByAdmin = true;
        agent.approvedAt = new Date();
        const savedAgent = await this.agentRepo.save(agent);
        if (savedAgent.user) {
            await this.notificationService.createNotification(savedAgent.user.id, notification_entity_1.NotificationType.KYC, 'Account Verified', 'Your agent account was successfully verified by admin. You can now list products on the marketplace.', { agentId: savedAgent.id }, 'projectStatusChanged');
        }
        try {
            await this.mailService.sendAgentApprovalNotification(savedAgent.user, savedAgent, true);
        }
        catch (error) {
            this.logger.warn('Failed to send approval email', error);
        }
        return savedAgent;
    }
    async rejectAgent(agentId, adminId, reason) {
        const agent = await this.agentRepo.findOne({
            where: { id: agentId },
            relations: ['user'],
        });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        agent.registrationStatus = agent_entity_1.AgentRegistrationStatus.REJECTED;
        agent.rejectionReason = reason;
        agent.kycStatus = agent_entity_1.AgentKycStatus.REJECTED;
        const savedAgent = await this.agentRepo.save(agent);
        try {
            await this.mailService.sendAgentRejectionNotification(savedAgent.user, savedAgent, reason);
        }
        catch (error) {
            this.logger.warn('Failed to send rejection email', error);
        }
        return savedAgent;
    }
    async getAgentByUserId(userId) {
        const agent = await this.agentRepo.findOne({
            where: { userId },
            relations: ['user', 'profile', 'bioRecord', 'kycRecords'],
        });
        if (!agent) {
            throw new common_1.NotFoundException('Agent profile not found for this user');
        }
        return agent;
    }
    async getAgentStatus(agentId) {
        const agent = await this.agentRepo.findOne({
            where: { id: agentId },
            relations: ['user', 'kycRecords'],
        });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        return {
            id: agent.id,
            registrationStatus: agent.registrationStatus,
            kycStatus: agent.kycStatus,
            isApproved: agent.isApprovedByAdmin,
            approvedAt: agent.approvedAt,
            rejectionReason: agent.rejectionReason,
        };
    }
    async create(userId, dto) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const wallet = new wallet_entity_1.Wallet();
        const agent = this.agentRepo.create({ ...dto, user, userId, wallet });
        return this.agentRepo.save(agent);
    }
    async findAllPros(paginationDto) {
        const { page = 1, limit = 10, search } = paginationDto;
        const skip = (page - 1) * limit;
        const query = this.agentRepo
            .createQueryBuilder('agent')
            .leftJoinAndSelect('agent.profile', 'profile')
            .leftJoinAndSelect('agent.user', 'user')
            .where('agent.registrationStatus = :status', {
            status: agent_entity_1.AgentRegistrationStatus.APPROVED,
        });
        if (search) {
            query.andWhere('(agent.businessName ILIKE :search OR user.firstName ILIKE :search OR user.lastName ILIKE :search)', { search: `%${search}%` });
        }
        const [agents, total] = await query
            .orderBy('agent.createdAt', 'DESC')
            .take(limit)
            .skip(skip)
            .getManyAndCount();
        const pros = await Promise.all(agents.map(async (agent) => {
            const products = await this.productRepo.find({
                where: { agentId: agent.id },
            });
            return this.mapToProOverview(agent, products);
        }));
        return {
            data: pros,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findAll(paginationDto) {
        const { page = 1, limit = 10, search } = paginationDto;
        const skip = (page - 1) * limit;
        const queryOptions = {
            where: { registrationStatus: agent_entity_1.AgentRegistrationStatus.APPROVED },
            relations: ['user', 'profile'],
            order: { createdAt: 'DESC' },
            take: limit,
            skip: skip,
        };
        if (search) {
            queryOptions.where = [
                {
                    registrationStatus: agent_entity_1.AgentRegistrationStatus.APPROVED,
                    businessName: (0, database_module_2.Like)(`%${search}%`),
                },
                {
                    registrationStatus: agent_entity_1.AgentRegistrationStatus.APPROVED,
                    user: { firstName: (0, database_module_2.Like)(`%${search}%`) },
                },
                {
                    registrationStatus: agent_entity_1.AgentRegistrationStatus.APPROVED,
                    user: { lastName: (0, database_module_2.Like)(`%${search}%`) },
                },
                {
                    registrationStatus: agent_entity_1.AgentRegistrationStatus.APPROVED,
                    user: { email: (0, database_module_2.Like)(`%${search}%`) },
                },
            ];
        }
        const [data, total] = await this.agentRepo.findAndCount(queryOptions);
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
    findOne(id) {
        return this.agentRepo.findOne({ where: { id }, relations: ['user'] });
    }
    async update(id, dto) {
        const agent = await this.findOne(id);
        if (!agent)
            throw new common_1.NotFoundException('Agent not found');
        Object.assign(agent, dto);
        return this.agentRepo.save(agent);
    }
    async remove(id) {
        const agent = await this.findOne(id);
        if (!agent)
            throw new common_1.NotFoundException('Agent not found');
        return this.agentRepo.softRemove(agent);
    }
    async addKycDocument(id, doc) {
        const agent = await this.findOne(id);
        if (!agent)
            throw new common_1.NotFoundException('Agent not found');
        let latestKyc = await this.kycRepo.findOne({
            where: { agentId: agent.id },
            order: { createdAt: 'DESC' },
        });
        if (!latestKyc) {
            latestKyc = this.kycRepo.create({
                agent,
                agentId: agent.id,
                idType: null,
                idNumber: null,
                documents: [doc],
                status: 'PENDING',
            });
        }
        else {
            latestKyc.documents = latestKyc.documents || [];
            latestKyc.documents.push(doc);
            latestKyc.status = 'PENDING';
        }
        await this.kycRepo.save(latestKyc);
        agent.kycStatus = agent_entity_1.AgentKycStatus.PENDING;
        const savedAgent = await this.agentRepo.save(agent);
        try {
            const admins = await this.adminRepo.find({ relations: ['user'] });
            for (const adm of admins) {
                if (adm.user)
                    await this.mailService.sendKycUploadedNotification(adm.user, savedAgent);
            }
        }
        catch (e) {
            this.logger.warn('Failed to notify admins about KYC upload', e?.toString());
        }
        try {
            const docs = (latestKyc.documents || []).map((d) => ({
                key: d.key,
                url: d.url,
                name: d.name || d.key,
            }));
            const result = await this.kycProvider.verifyDocuments(docs);
            if (result.success) {
                latestKyc.status = 'VERIFIED';
                await this.kycRepo.save(latestKyc);
                savedAgent.kycStatus = agent_entity_1.AgentKycStatus.VERIFIED;
            }
            else {
                latestKyc.status = 'REJECTED';
                await this.kycRepo.save(latestKyc);
                savedAgent.kycStatus = agent_entity_1.AgentKycStatus.REJECTED;
            }
            await this.agentRepo.save(savedAgent);
        }
        catch (err) {
            this.logger.warn('KYC provider call failed', err?.toString());
        }
        return savedAgent;
    }
    async setKycStatus(id, status) {
        const agent = await this.findOne(id);
        if (!agent)
            throw new common_1.NotFoundException('Agent not found');
        const latestKyc = await this.kycRepo.findOne({
            where: { agentId: agent.id },
            order: { createdAt: 'DESC' },
        });
        if (latestKyc) {
            latestKyc.status =
                status === agent_entity_1.AgentKycStatus.VERIFIED
                    ? 'VERIFIED'
                    : status === agent_entity_1.AgentKycStatus.REJECTED
                        ? 'REJECTED'
                        : 'PENDING';
            await this.kycRepo.save(latestKyc);
        }
        agent.kycStatus = status;
        const savedAgent = await this.agentRepo.save(agent);
        if (status === agent_entity_1.AgentKycStatus.VERIFIED && savedAgent.user) {
            await this.notificationService.createNotification(savedAgent.user.id, notification_entity_1.NotificationType.KYC, 'Account Verified', 'Your agent KYC has been verified.', { agentId: savedAgent.id }, 'projectStatusChanged');
        }
        return savedAgent;
    }
    async findProById(id) {
        const agent = await this.agentRepo.findOne({
            where: {
                id,
                registrationStatus: agent_entity_1.AgentRegistrationStatus.APPROVED,
            },
            relations: ['user', 'profile'],
        });
        if (!agent) {
            throw new common_1.NotFoundException(`Approved agent with ID ${id} not found`);
        }
        const products = await this.productRepo.find({
            where: { agentId: agent.id },
        });
        return this.mapToProOverview(agent, products);
    }
    mapToProOverview(agent, products) {
        let totalRating = 0;
        let ratedProductsCount = 0;
        products.forEach((p) => {
            if (p.ratingCount > 0) {
                totalRating += Number(p.averageRating);
                ratedProductsCount++;
            }
        });
        const avgRating = ratedProductsCount > 0
            ? Number((totalRating / ratedProductsCount).toFixed(1))
            : 0;
        let minPrice = 0;
        if (products.length > 0) {
            minPrice = Math.min(...products.map((p) => Number(p.price)));
        }
        const profTitle = agent.profile?.preferredTitle || 'Pro';
        const specs = agent.profile?.specialization || [];
        const combinedTitle = [profTitle, ...specs].join(', ');
        return {
            id: agent.id,
            businessName: agent.businessName || 'Unnamed Business',
            profilePicture: agent.profile?.profilePicture || '',
            professionalTitle: combinedTitle,
            specializations: specs,
            rating: avgRating,
            yearsOfExperience: agent.profile?.yearsOfExperience || 0,
            completedProjects: agent.profile?.completedProjectsCount || 0,
            location: agent.profile?.location || 'Unknown',
            priceRange: minPrice > 0
                ? `from ₦${(minPrice / 1000).toFixed(0)}k`
                : 'Contact for pricing',
            responseTime: agent.profile?.responseTime || 'replies in 1 hour',
        };
    }
};
exports.AgentService = AgentService;
exports.AgentService = AgentService = AgentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, database_module_1.InjectRepository)(agent_entity_1.Agent)),
    __param(1, (0, database_module_1.InjectRepository)(agent_profile_entity_1.AgentProfile)),
    __param(2, (0, database_module_1.InjectRepository)(agent_bio_entity_1.AgentBio)),
    __param(3, (0, database_module_1.InjectRepository)(agent_kyc_entity_1.AgentKyc)),
    __param(4, (0, database_module_1.InjectRepository)(user_entity_1.User)),
    __param(5, (0, database_module_1.InjectRepository)(admin_entity_1.Admin)),
    __param(6, (0, database_module_1.InjectRepository)(marketproduct_entity_1.MarketProduct)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object, uverify_provider_1.UverifyKycProvider,
        mail_service_1.AgentMailService,
        notification_service_1.NotificationService])
], AgentService);
//# sourceMappingURL=agent.service.js.map