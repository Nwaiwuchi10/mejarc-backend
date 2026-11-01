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
exports.CustomDesignService = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("../database/database.module");
const customdesign_entity_1 = require("./entities/customdesign.entity");
const customdesign_types_1 = require("./customdesign.types");
const agent_entity_1 = require("../agent/entities/agent.entity");
const services_config_1 = require("./config/services.config");
const custom_design_payment_entity_1 = require("./entities/custom-design-payment.entity");
const wallet_service_1 = require("../wallet/wallet.service");
const wallet_transaction_entity_1 = require("../wallet/entities/wallet-transaction.entity");
const notification_service_1 = require("../notification/notification.service");
const notification_entity_1 = require("../notification/entities/notification.entity");
const admin_entity_1 = require("../admin/entities/admin.entity");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let CustomDesignService = class CustomDesignService {
    constructor(repo, paymentRepo, adminRepo, walletService, notificationService, configService) {
        this.repo = repo;
        this.paymentRepo = paymentRepo;
        this.adminRepo = adminRepo;
        this.walletService = walletService;
        this.notificationService = notificationService;
        this.configService = configService;
        this.PAYSTACK_INIT_URL = 'https://api.paystack.co/transaction/initialize';
        this.PAYSTACK_VERIFY_URL = 'https://api.paystack.co/transaction/verify';
    }
    async initialize(userId, dto, agentId) {
        if (agentId) {
            const agent = (await this.repo.manager.findOne('Agent', {
                where: { id: agentId },
            }));
            if (agent &&
                agent.registrationStatus !== agent_entity_1.AgentRegistrationStatus.APPROVED) {
                throw new common_1.BadRequestException('The selected agent is not currently approved to accept new projects.');
            }
        }
        dto.serviceType = this.mapCategoryToServiceType(dto.serviceType);
        const draft = this.repo.create({
            userId,
            agentId,
            serviceType: dto.serviceType,
            serviceContext: dto.serviceContext,
            selectionMethod: this.mapMethodToSelectionMethod(dto.selectionMethod),
            currentStep: 1,
            status: customdesign_types_1.CustomDesignStatus.IN_PROGRESS,
            isSubmitted: false,
            scopeDeliverables: [],
            attachedFiles: [],
        });
        const saved = await this.repo.save(draft);
        return this.toResponse(saved);
    }
    async createAndSubmit(userId, dto, contextAgentId, files) {
        dto.serviceType = this.mapCategoryToServiceType(dto.serviceType);
        this.validateSubmissionFields(dto);
        const agentId = dto.agentId || contextAgentId;
        const uploadedUrls = this.extractS3Urls(files);
        const combinedFiles = [...(dto.attachedFiles ?? []), ...uploadedUrls];
        const design = this.repo.create({
            userId,
            agentId,
            serviceType: dto.serviceType,
            serviceContext: dto.serviceContext,
            projectType: dto.projectType,
            scopeDeliverables: dto.scopeDeliverables ?? [],
            sizeComplexity: dto.sizeComplexity,
            style: dto.style,
            budget: dto.budget,
            timeline: dto.timeline,
            additionalInformation: dto.additionalInformation,
            attachedFiles: combinedFiles,
            selectionMethod: this.mapMethodToSelectionMethod(dto.selectionMethod),
            currentStep: 6,
            status: customdesign_types_1.CustomDesignStatus.SUBMITTED,
            isSubmitted: true,
            submittedAt: new Date(),
        });
        const estimate = this.computeEstimate(design);
        design.estimateCost = estimate.estimateCost;
        design.estimateTimeline = estimate.estimateTimeline;
        const saved = await this.repo.save(design);
        return this.toResponse(saved);
    }
    async saveStep(id, userId, dto, files) {
        const design = await this.getOwnedDesign(id, userId);
        this.assertEditable(design);
        const { step, data } = dto;
        const uploadedUrls = this.extractS3Urls(files);
        switch (step) {
            case 1:
                if (data.serviceType)
                    design.serviceType = data.serviceType;
                if (data.serviceContext)
                    design.serviceContext = data.serviceContext;
                break;
            case 2:
                if (data.projectType !== undefined)
                    design.projectType = data.projectType;
                design.currentStep = Math.max(design.currentStep, 2);
                break;
            case 3:
                if (data.scopeDeliverables !== undefined)
                    design.scopeDeliverables = data.scopeDeliverables;
                design.currentStep = Math.max(design.currentStep, 3);
                break;
            case 4:
                if (data.sizeComplexity !== undefined)
                    design.sizeComplexity = data.sizeComplexity;
                design.currentStep = Math.max(design.currentStep, 4);
                break;
            case 5:
                if (data.style !== undefined)
                    design.style = data.style;
                design.currentStep = Math.max(design.currentStep, 5);
                break;
            case 6:
                if (data.budget !== undefined)
                    design.budget = Number(data.budget);
                if (data.timeline !== undefined)
                    design.timeline = data.timeline;
                if (data.additionalInformation !== undefined)
                    design.additionalInformation = data.additionalInformation;
                const attachedFromData = data.attachedFiles ?? [];
                design.attachedFiles = [
                    ...(design.attachedFiles ?? []),
                    ...attachedFromData,
                    ...uploadedUrls,
                ];
                design.currentStep = 6;
                break;
            default:
                throw new common_1.BadRequestException(`Invalid step: ${step}. Must be 1–6.`);
        }
        const saved = await this.repo.save(design);
        return this.toResponse(saved);
    }
    async update(id, userId, dto, files) {
        const design = await this.getOwnedDesign(id, userId);
        this.assertEditable(design);
        Object.assign(design, dto);
        if (files && files.length > 0) {
            const uploadedUrls = this.extractS3Urls(files);
            design.attachedFiles = [...(design.attachedFiles ?? []), ...uploadedUrls];
        }
        const saved = await this.repo.save(design);
        if (files && files.length > 0 && design.agentId) {
            const agent = (await this.repo.manager.findOne('Agent', {
                where: { id: design.agentId },
                relations: ['user'],
            }));
            if (agent?.user) {
                await this.notificationService.createNotification(agent.user.id, notification_entity_1.NotificationType.CUSTOMDESIGN, 'New File Uploaded', `A new file was uploaded for project "${design.serviceContext}".`, { customDesignId: id }, 'projectFileUploaded');
            }
        }
        return this.toResponse(saved);
    }
    async submit(id, userId, dto, files) {
        const design = await this.getOwnedDesign(id, userId);
        if (design.status === customdesign_types_1.CustomDesignStatus.SUBMITTED) {
            throw new common_1.BadRequestException('Custom design has already been submitted.');
        }
        if (design.status === customdesign_types_1.CustomDesignStatus.COMPLETED) {
            throw new common_1.BadRequestException('Cannot re-submit a completed custom design.');
        }
        if (dto) {
            if (dto.budget !== undefined)
                design.budget = Number(dto.budget);
            if (dto.timeline !== undefined)
                design.timeline = dto.timeline;
            if (dto.additionalInformation !== undefined)
                design.additionalInformation = dto.additionalInformation;
            if (dto.attachedFiles !== undefined) {
                design.attachedFiles = [
                    ...(design.attachedFiles ?? []),
                    ...dto.attachedFiles,
                ];
            }
        }
        if (files && files.length > 0) {
            const uploadedUrls = this.extractS3Urls(files);
            design.attachedFiles = [...(design.attachedFiles ?? []), ...uploadedUrls];
        }
        this.validateSubmissionFields(design);
        const estimate = this.computeEstimate(design);
        design.estimateCost = estimate.estimateCost;
        design.estimateTimeline = estimate.estimateTimeline;
        design.status = customdesign_types_1.CustomDesignStatus.SUBMITTED;
        design.isSubmitted = true;
        design.submittedAt = new Date();
        design.currentStep = 6;
        const saved = await this.repo.save(design);
        try {
            const admins = await this.adminRepo.find({ relations: ['user'] });
            for (const admin of admins) {
                if (admin.user) {
                    await this.notificationService.createNotification(admin.user.id, notification_entity_1.NotificationType.ADMIN, 'New Custom Design Submission', `A new custom design project "${design.serviceContext}" has been submitted.`, { customDesignId: id }, 'messagesAdmin');
                }
            }
        }
        catch (err) {
            console.error('Failed to notify admins of submission:', err);
        }
        return this.toResponse(saved);
    }
    async findById(id) {
        const design = await this.repo.findOne({
            where: { id },
            relations: ['user', 'agent', 'agent.user', 'payment'],
        });
        if (!design)
            throw new common_1.NotFoundException('Custom design not found');
        return this.toResponse(design);
    }
    async findMyDesigns(userId, query) {
        return this.paginatedQuery({ userId }, query);
    }
    async findByAgent(agentId, query) {
        return this.paginatedQuery({ agentId }, query);
    }
    async findByUser(userId, query) {
        return this.paginatedQuery({ userId }, query);
    }
    async delete(id, userId) {
        const design = await this.getOwnedDesign(id, userId);
        if (design.isSubmitted) {
            throw new common_1.BadRequestException('Cannot delete a submitted custom design.');
        }
        await this.repo.remove(design);
    }
    getServiceConfig(serviceType) {
        return (0, services_config_1.getServiceConfig)(serviceType);
    }
    mapCategoryToServiceType(category) {
        const normalized = category?.toLowerCase().replace(/\s/g, '');
        if (Object.values(customdesign_types_1.ServiceType).includes(category)) {
            return category;
        }
        const mapping = {
            landscape: customdesign_types_1.ServiceType.LANDSCAPE_DESIGN,
            landscapedesign: customdesign_types_1.ServiceType.LANDSCAPE_DESIGN,
            interiordesign: customdesign_types_1.ServiceType.INTERIOR_DESIGN,
            interiordesign2: customdesign_types_1.ServiceType.INTERIOR_DESIGN,
            productdesign: customdesign_types_1.ServiceType.PRODUCT_DESIGN,
            '3drendering': customdesign_types_1.ServiceType.RENDERING_3D,
            '3drendering&visualization': customdesign_types_1.ServiceType.RENDERING_3D,
            '2darchitectural': customdesign_types_1.ServiceType.ARCHITECTURAL_2D,
            '2darchitecturaldrawings': customdesign_types_1.ServiceType.ARCHITECTURAL_2D,
            bim: customdesign_types_1.ServiceType.BIM,
            buildinginformationmodeling: customdesign_types_1.ServiceType.BIM,
            'mechanical-electrical': customdesign_types_1.ServiceType.MEP_DRAWINGS,
            mechanicalelectricaldrawings: customdesign_types_1.ServiceType.MEP_DRAWINGS,
            structural: customdesign_types_1.ServiceType.STRUCTURAL_ENGINEERING,
            structuralengineeringdrawings: customdesign_types_1.ServiceType.STRUCTURAL_ENGINEERING,
        };
        const mapped = mapping[normalized];
        if (!mapped) {
            return category;
        }
        return mapped;
    }
    mapMethodToSelectionMethod(method) {
        if (!method)
            return customdesign_types_1.SelectionMethod.MANUAL;
        const normalized = method.toLowerCase().replace(/\s/g, '');
        if (normalized === 'ai')
            return customdesign_types_1.SelectionMethod.AI_ADVICE;
        if (normalized === 'manual' || normalized === 'hireapro')
            return customdesign_types_1.SelectionMethod.HIRE_PRO;
        if (normalized === 'contest')
            return customdesign_types_1.SelectionMethod.CONTEST;
        if (normalized === 'fixedquote')
            return customdesign_types_1.SelectionMethod.FIXED_QUOTE;
        if (normalized === 'template')
            return customdesign_types_1.SelectionMethod.TEMPLATE;
        if (Object.values(customdesign_types_1.SelectionMethod).includes(method)) {
            return method;
        }
        return customdesign_types_1.SelectionMethod.MANUAL;
    }
    extractS3Urls(files) {
        if (!files || !Array.isArray(files))
            return [];
        return files.map((f) => f.location).filter((url) => !!url);
    }
    async validateStepData(serviceType, step, data) {
        const config = (0, services_config_1.getServiceConfig)(serviceType);
        const errors = [];
        switch (step) {
            case 1: {
                const valid = config.contexts.find((c) => c.title === data.serviceContext);
                if (!valid)
                    errors.push('Invalid service context selection');
                break;
            }
            case 2: {
                const valid = config.projectTypes.find((p) => p.title === data.projectType);
                if (!valid)
                    errors.push('Invalid project type selection');
                break;
            }
            case 3: {
                const deliverables = data.scopeDeliverables ?? [];
                if (deliverables.length === 0) {
                    errors.push('At least one scope deliverable must be selected');
                    break;
                }
                const baseValid = config.scopes.find((s) => s.title === deliverables[0]);
                if (!baseValid)
                    errors.push(`Invalid scope package: "${deliverables[0]}"`);
                for (const addon of deliverables.slice(1)) {
                    const addonValid = config.addons.find((a) => a.title === addon);
                    if (!addonValid)
                        errors.push(`Invalid addon: "${addon}"`);
                }
                break;
            }
            case 4: {
                const valid = config.sizes.find((s) => s.title === data.sizeComplexity);
                if (!valid)
                    errors.push('Invalid size/complexity selection');
                break;
            }
            case 5: {
                const valid = config.styles.find((s) => s.title === data.style);
                if (!valid)
                    errors.push('Invalid style selection');
                break;
            }
            case 6: {
                const budget = Number(data.budget);
                if (!budget || budget < config.minimumBudget) {
                    errors.push(`Minimum budget is ${config.currency}${config.minimumBudget.toLocaleString()}`);
                }
                if (!data.timeline || String(data.timeline).trim() === '') {
                    errors.push('Timeline is required');
                }
                break;
            }
            default:
                errors.push('Invalid step number');
        }
        return {
            isValid: errors.length === 0,
            errors: errors.length > 0 ? errors : undefined,
        };
    }
    async approve(id, notes) {
        const design = await this.repo.findOne({ where: { id } });
        if (!design)
            throw new common_1.NotFoundException('Custom design not found');
        if (design.status !== customdesign_types_1.CustomDesignStatus.SUBMITTED &&
            design.status !== customdesign_types_1.CustomDesignStatus.UNDER_REVIEW) {
            throw new common_1.BadRequestException('Only submitted or under-review designs can be approved');
        }
        design.status = customdesign_types_1.CustomDesignStatus.APPROVED;
        design.reviewNotes = notes;
        design.reviewedAt = new Date();
        const saved = await this.repo.save(design);
        await this.notificationService.createNotification(design.userId, notification_entity_1.NotificationType.CUSTOMDESIGN, 'Project Approved', `Your custom design project "${design.serviceContext}" has been approved.`, { customDesignId: id, status: design.status }, 'projectStatusChanged');
        return this.toResponse(saved);
    }
    async reject(id, reason) {
        const design = await this.repo.findOne({ where: { id } });
        if (!design)
            throw new common_1.NotFoundException('Custom design not found');
        if (design.status !== customdesign_types_1.CustomDesignStatus.SUBMITTED &&
            design.status !== customdesign_types_1.CustomDesignStatus.UNDER_REVIEW) {
            throw new common_1.BadRequestException('Only submitted or under-review designs can be rejected');
        }
        design.status = customdesign_types_1.CustomDesignStatus.REJECTED;
        design.reviewNotes = reason;
        design.reviewedAt = new Date();
        const saved = await this.repo.save(design);
        await this.notificationService.createNotification(design.userId, notification_entity_1.NotificationType.CUSTOMDESIGN, 'Project Rejected', `Your custom design project "${design.serviceContext}" has been rejected. Reason: ${reason || 'N/A'}`, { customDesignId: id, status: design.status }, 'projectStatusChanged');
        return this.toResponse(saved);
    }
    async agentApprove(id, userId, notes) {
        const design = await this.repo.findOne({ where: { id } });
        if (!design)
            throw new common_1.NotFoundException('Custom design not found');
        const agent = (await this.repo.manager.findOne('Agent', {
            where: { userId },
        }));
        if (!agent)
            throw new common_1.ForbiddenException('Only registered agents can perform this action');
        if (design.agentId !== agent.id)
            throw new common_1.ForbiddenException('You are not assigned to this project');
        if (design.status !== customdesign_types_1.CustomDesignStatus.SUBMITTED &&
            design.status !== customdesign_types_1.CustomDesignStatus.UNDER_REVIEW) {
            throw new common_1.BadRequestException('Only submitted or under-review designs can be approved');
        }
        design.status = customdesign_types_1.CustomDesignStatus.APPROVED;
        design.reviewNotes = notes;
        design.reviewedAt = new Date();
        const saved = await this.repo.save(design);
        await this.notificationService.createNotification(design.userId, notification_entity_1.NotificationType.CUSTOMDESIGN, 'Project Accepted by Agent', `Your custom design project "${design.serviceContext}" has been accepted by the assigned agent.`, { customDesignId: id, status: design.status }, 'projectStatusChanged');
        return this.toResponse(saved);
    }
    async agentReject(id, userId, reason) {
        const design = await this.repo.findOne({ where: { id } });
        if (!design)
            throw new common_1.NotFoundException('Custom design not found');
        const agent = (await this.repo.manager.findOne('Agent', {
            where: { userId },
        }));
        if (!agent)
            throw new common_1.ForbiddenException('Only registered agents can perform this action');
        if (design.agentId !== agent.id)
            throw new common_1.ForbiddenException('You are not assigned to this project');
        if (design.status !== customdesign_types_1.CustomDesignStatus.SUBMITTED &&
            design.status !== customdesign_types_1.CustomDesignStatus.UNDER_REVIEW) {
            throw new common_1.BadRequestException('Only submitted or under-review designs can be rejected');
        }
        design.status = customdesign_types_1.CustomDesignStatus.REJECTED;
        design.reviewNotes = reason;
        design.reviewedAt = new Date();
        const saved = await this.repo.save(design);
        await this.notificationService.createNotification(design.userId, notification_entity_1.NotificationType.CUSTOMDESIGN, 'Project Declined by Agent', `Your custom design project "${design.serviceContext}" has been declined by the assigned agent. Reason: ${reason || 'N/A'}`, { customDesignId: id, status: design.status }, 'projectStatusChanged');
        return this.toResponse(saved);
    }
    async getOwnedDesign(id, userId) {
        const design = await this.repo.findOne({ where: { id } });
        if (!design)
            throw new common_1.NotFoundException('Custom design not found');
        if (design.userId !== userId) {
            throw new common_1.ForbiddenException('You do not have permission to modify this custom design');
        }
        return design;
    }
    assertEditable(design) {
        if (design.status === customdesign_types_1.CustomDesignStatus.SUBMITTED ||
            design.status === customdesign_types_1.CustomDesignStatus.COMPLETED) {
            throw new common_1.BadRequestException('Cannot modify a submitted or completed custom design');
        }
    }
    validateSubmissionFields(design) {
        const required = [
            'serviceType',
            'serviceContext',
            'projectType',
            'sizeComplexity',
            'style',
            'budget',
            'timeline',
        ];
        const missing = required.filter((f) => !design[f]);
        const deliverables = design.scopeDeliverables;
        if (!deliverables || deliverables.length === 0) {
            missing.push('scopeDeliverables');
        }
        if (missing.length > 0) {
            throw new common_1.BadRequestException(`Cannot submit incomplete custom design. Missing fields: ${missing.join(', ')}`);
        }
    }
    computeEstimate(design) {
        if (!design.serviceType) {
            return { estimateCost: 0, estimateTimeline: design.timeline ?? 'TBD' };
        }
        let config;
        try {
            config = (0, services_config_1.getServiceConfig)(design.serviceType);
        }
        catch {
            return { estimateCost: 0, estimateTimeline: design.timeline ?? 'TBD' };
        }
        let cost = config.minimumBudget;
        const scopeMultipliers = {
            'Basic Package': 1.0,
            'Intermediate Package': 1.5,
            'Advanced Package': 2.0,
            'Standard Package': 1.4,
            'Complete Package': 2.0,
            'Standard Rendering': 1.0,
            'Multi-Perspective Package': 1.6,
            'Full Experience Package': 2.4,
            'Basic Package – LOD 200': 1.0,
            'Intermediate Package – LOD 300': 1.6,
            'Advanced Package – LOD 400/500': 2.5,
        };
        const deliverables = design.scopeDeliverables ?? [];
        const basePackage = deliverables[0] ?? '';
        const scopeMult = scopeMultipliers[basePackage] ?? 1.0;
        cost = Math.ceil(cost * scopeMult);
        const addons = deliverables.slice(1);
        if (addons.length > 0) {
            cost = Math.ceil(cost * (1 + addons.length * 0.12));
        }
        const sizeMultipliers = {
            'Small (under 200 sqm)': 0.8,
            'Medium (200-1000 sqm)': 1.0,
            'Large (1000 sqm and above)': 1.5,
            'Single Room': 0.7,
            'Full Apartment': 1.0,
            'Multi-Floor or Complex Space': 1.5,
            'Single Image': 0.7,
            '3-5 Images': 1.0,
            '6+ Images / Animation': 1.6,
            'Small (1-2 floors)': 0.8,
            'Medium (3-5 floors)': 1.0,
            'Large (6+ floors or complex)': 1.5,
            'Single Dwelling': 0.8,
            'Multi-Unit Building': 1.2,
            'High-Rise / Complex Facility': 1.8,
            Small: 0.8,
            Medium: 1.0,
            Large: 1.5,
        };
        const sizeMult = sizeMultipliers[design.sizeComplexity ?? ''] ?? 1.0;
        cost = Math.ceil(cost * sizeMult);
        return {
            estimateCost: cost,
            estimateTimeline: design.timeline ?? 'Based on selection',
        };
    }
    async paginatedQuery(where, query) {
        const { page = 1, limit = 10, serviceType, status } = query;
        const qb = this.repo.createQueryBuilder('cd');
        Object.entries(where).forEach(([key, val]) => {
            if (val !== undefined)
                qb.andWhere(`cd.${key} = :${key}`, { [key]: val });
        });
        if (serviceType)
            qb.andWhere('cd.serviceType = :serviceType', { serviceType });
        if (status)
            qb.andWhere('cd.status = :status', { status });
        const total = await qb.getCount();
        const data = await qb
            .leftJoinAndSelect('cd.user', 'user')
            .leftJoinAndSelect('cd.agent', 'agent')
            .leftJoinAndSelect('agent.user', 'agentUser')
            .leftJoinAndSelect('cd.payment', 'payment')
            .orderBy('cd.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();
        return { data: data.map((d) => this.toResponse(d)), total, page, limit };
    }
    toResponse(design) {
        return {
            id: design.id,
            userId: design.userId,
            user: design.user,
            agentId: design.agentId,
            agent: design.agent,
            serviceType: design.serviceType,
            selectionMethod: design.selectionMethod ?? customdesign_types_1.SelectionMethod.MANUAL,
            serviceContext: design.serviceContext,
            projectType: design.projectType,
            scopeDeliverables: design.scopeDeliverables ?? [],
            sizeComplexity: design.sizeComplexity,
            style: design.style,
            budget: design.budget ? Number(design.budget) : undefined,
            timeline: design.timeline,
            additionalInformation: design.additionalInformation,
            attachedFiles: design.attachedFiles ?? [],
            currentStep: design.currentStep,
            status: design.status,
            isSubmitted: design.isSubmitted,
            submittedAt: design.submittedAt,
            estimateCost: design.estimateCost
                ? Number(design.estimateCost)
                : undefined,
            estimateTimeline: design.estimateTimeline,
            estimateNotes: design.estimateNotes,
            payment: design.payment,
            createdAt: design.createdAt,
            updatedAt: design.updatedAt,
        };
    }
    async setAgreedPrice(id, userId, dto) {
        const design = await this.getOwnedDesign(id, userId);
        if (design.status !== customdesign_types_1.CustomDesignStatus.APPROVED) {
            throw new common_1.BadRequestException('Can only set agreed price for approved designs');
        }
        if (!design.agentId) {
            throw new common_1.BadRequestException('No agent assigned to this custom design');
        }
        let payment = await this.paymentRepo.findOne({
            where: { customDesignId: id },
        });
        if (payment && payment.status === custom_design_payment_entity_1.CustomDesignPaymentStatus.PAID) {
            throw new common_1.BadRequestException('This design has already been paid for');
        }
        if (!payment) {
            payment = this.paymentRepo.create({
                customDesignId: id,
                userId,
                agreedPrice: dto.price,
                status: custom_design_payment_entity_1.CustomDesignPaymentStatus.PENDING_AGREEMENT,
            });
        }
        else {
            payment.agreedPrice = dto.price;
            payment.status = custom_design_payment_entity_1.CustomDesignPaymentStatus.PENDING_AGREEMENT;
            payment.isConfirmedByAgent = false;
        }
        await this.paymentRepo.save(payment);
        const agent = (await this.repo.manager.findOne('Agent', {
            where: { id: design.agentId },
            relations: ['user'],
        }));
        if (agent?.user) {
            await this.notificationService.createNotification(agent.user.id, notification_entity_1.NotificationType.AGENT_MESSAGE, 'Price Agreement Requested', `User has set an agreed price of ₦${dto.price} for a custom design project. Please confirm.`, { customDesignId: id, price: dto.price }, 'messagesAgent');
        }
        const admins = await this.adminRepo.find({ relations: ['user'] });
        for (const admin of admins) {
            if (admin.user) {
                await this.notificationService.createNotification(admin.user.id, notification_entity_1.NotificationType.WALLET, 'Price Agreement Update', `An agreed price of ₦${dto.price} has been set for a custom design project.`, { customDesignId: id, price: dto.price });
            }
        }
        return {
            message: 'Agreed price set. Waiting for agent confirmation.',
            payment,
        };
    }
    async confirmAgreedPrice(id, agentUserId) {
        const design = await this.repo.findOne({
            where: { id },
            relations: ['agent', 'agent.user'],
        });
        if (!design)
            throw new common_1.NotFoundException('Custom design not found');
        if (design.agent?.userId !== agentUserId) {
            throw new common_1.ForbiddenException('Only the assigned agent can confirm the price');
        }
        if (design.agent?.registrationStatus !== agent_entity_1.AgentRegistrationStatus.APPROVED) {
            throw new common_1.ForbiddenException('Your agent account is not currently approved to perform this action.');
        }
        const payment = await this.paymentRepo.findOne({
            where: { customDesignId: id },
        });
        if (!payment)
            throw new common_1.NotFoundException("Price hasn't been set by the user yet");
        payment.isConfirmedByAgent = true;
        payment.status = custom_design_payment_entity_1.CustomDesignPaymentStatus.AWAITING_PAYMENT;
        await this.paymentRepo.save(payment);
        await this.notificationService.createNotification(design.userId, notification_entity_1.NotificationType.CUSTOMDESIGNPAYMENT, 'Price Agreement Confirmed', `The agent has confirmed the agreed price of ₦${payment.agreedPrice}. You can now proceed to payment.`, { customDesignId: id, price: payment.agreedPrice }, 'paymentOrderConfirmation');
        return { message: 'Price confirmed. User can now pay.', payment };
    }
    async initializePayment(id, userId) {
        const payment = await this.paymentRepo.findOne({
            where: { customDesignId: id, userId },
            relations: ['user'],
        });
        if (!payment)
            throw new common_1.NotFoundException('Payment record not found');
        if (!payment.isConfirmedByAgent) {
            throw new common_1.BadRequestException('Agent has not confirmed the agreed price yet');
        }
        if (payment.status === custom_design_payment_entity_1.CustomDesignPaymentStatus.PAID) {
            throw new common_1.BadRequestException('This design is already paid');
        }
        const amountInKobo = Math.round(Number(payment.agreedPrice) * 100);
        const callbackUrl = this.configService.get('PAYSTACK_CALLBACK_URL') ||
            'http://localhost:3000/custom-design/verify-payment';
        try {
            const response = await axios_1.default.post(this.PAYSTACK_INIT_URL, {
                email: payment.user.email,
                amount: amountInKobo,
                callback_url: callbackUrl,
                metadata: {
                    customDesignId: id,
                    paymentId: payment.id,
                    type: 'custom_design_payment',
                },
            }, {
                headers: {
                    Authorization: `Bearer ${this.configService.get('PAYSTACK_SECRET_KEY')}`,
                },
            });
            payment.paystackData = response.data.data;
            await this.paymentRepo.save(payment);
            return response.data.data;
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to initialize Paystack payment: ' +
                (error.response?.data?.message || error.message));
        }
    }
    async verifyPayment(reference) {
        try {
            const response = await axios_1.default.get(`${this.PAYSTACK_VERIFY_URL}/${reference}`, {
                headers: {
                    Authorization: `Bearer ${this.configService.get('PAYSTACK_SECRET_KEY')}`,
                },
            });
            const data = response.data.data;
            if (data.status !== 'success')
                throw new common_1.BadRequestException('Payment verification failed.');
            const paymentRecord = await this.paymentRepo
                .createQueryBuilder('p')
                .leftJoinAndSelect('p.customDesign', 'cd')
                .leftJoinAndSelect('cd.agent', 'agent')
                .leftJoinAndSelect('agent.user', 'user')
                .where(`p.paystackData->>'reference' = :reference`, { reference })
                .getOne();
            if (!paymentRecord)
                throw new common_1.BadRequestException(`Payment with reference ${reference} not found.`);
            if (paymentRecord.status === custom_design_payment_entity_1.CustomDesignPaymentStatus.PAID)
                return { message: 'Already verified', payment: paymentRecord };
            const amountPaid = data.amount / 100;
            paymentRecord.status = custom_design_payment_entity_1.CustomDesignPaymentStatus.PAID;
            paymentRecord.amountPaid = amountPaid;
            paymentRecord.paidAt = new Date();
            await this.paymentRepo.save(paymentRecord);
            if (paymentRecord.customDesign?.agentId) {
                const agentShare = amountPaid * 0.9;
                const description = `Custom Design Completion: ${paymentRecord.customDesign.serviceContext}`;
                await this.walletService.creditWallet(paymentRecord.customDesign.agentId, agentShare, description, wallet_transaction_entity_1.TransactionCategory.CUSTOM_DESIGN);
            }
            paymentRecord.customDesign.status = customdesign_types_1.CustomDesignStatus.COMPLETED;
            await this.repo.save(paymentRecord.customDesign);
            await this.notificationService.createNotification(paymentRecord.userId, notification_entity_1.NotificationType.CUSTOMDESIGNPAYMENT, 'Payment Successful', `Your payment of ₦${amountPaid} for custom design "${paymentRecord.customDesign.serviceContext}" was successful.`, { customDesignId: paymentRecord.customDesignId }, 'paymentSuccessful');
            if (paymentRecord.customDesign.agentId &&
                paymentRecord.customDesign.agent?.user) {
                await this.notificationService.createNotification(paymentRecord.customDesign.agent.user.id, notification_entity_1.NotificationType.AGENT_MESSAGE, 'New Payment Received', `You have received a payment for project "${paymentRecord.customDesign.serviceContext}".`, { customDesignId: paymentRecord.customDesignId }, 'messagesAgent');
            }
            return {
                message: 'Payment verified and agent credited',
                payment: paymentRecord,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Verification failed: ' + error.message);
        }
    }
};
exports.CustomDesignService = CustomDesignService;
exports.CustomDesignService = CustomDesignService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, database_module_1.InjectRepository)(customdesign_entity_1.CustomDesign)),
    __param(1, (0, database_module_1.InjectRepository)(custom_design_payment_entity_1.CustomDesignPayment)),
    __param(2, (0, database_module_1.InjectRepository)(admin_entity_1.Admin)),
    __metadata("design:paramtypes", [Object, Object, Object, wallet_service_1.WalletService,
        notification_service_1.NotificationService,
        config_1.ConfigService])
], CustomDesignService);
//# sourceMappingURL=customdesign.service.js.map