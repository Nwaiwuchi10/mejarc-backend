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
exports.MarketproductService = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("../database/database.module");
const database_module_2 = require("../database/database.module");
const marketproduct_entity_1 = require("./entities/marketproduct.entity");
const rating_entity_1 = require("./entities/rating.entity");
const agent_entity_1 = require("../agent/entities/agent.entity");
const mail_service_1 = require("./service/mail.service");
const notification_service_1 = require("../notification/notification.service");
const notification_entity_1 = require("../notification/entities/notification.entity");
let MarketproductService = class MarketproductService {
    constructor(productRepo, agentRepo, ratingRepo, mailService, notificationService) {
        this.productRepo = productRepo;
        this.agentRepo = agentRepo;
        this.ratingRepo = ratingRepo;
        this.mailService = mailService;
        this.notificationService = notificationService;
    }
    async create(agentId, dto, files) {
        const agent = await this.agentRepo.findOne({
            where: { id: agentId },
            relations: ['user'],
        });
        if (!agent) {
            throw new common_1.NotFoundException('Agent not found');
        }
        if (agent.registrationStatus !== agent_entity_1.AgentRegistrationStatus.APPROVED) {
            throw new common_1.BadRequestException(`Agent account is not approved. Current status: ${agent.registrationStatus}.`);
        }
        const productImage = files?.productImage?.map((f) => f.location) || [];
        const architecturalPlan = files?.architecturalPlan?.map((f) => f.location) || [];
        const structuralPlan = files?.structuralPlan?.map((f) => f.location) || [];
        const electricalPlan = files?.electricalPlan?.map((f) => f.location) || [];
        const mechanicalPlan = files?.mechanicalPlan?.map((f) => f.location) || [];
        let prefix = 'BLP';
        const cat = String(dto.category || '').toLowerCase();
        if (cat.includes('product') || cat.includes('design') || cat.includes('interior')) {
            prefix = 'PRD';
        }
        else if (cat.includes('guide')) {
            prefix = 'BLG';
        }
        const count = await this.productRepo.count();
        const sequentialNum = String(count + 1).padStart(3, '0');
        const customProductId = `${prefix}${sequentialNum}`;
        const product = this.productRepo.create({
            ...dto,
            productId: customProductId,
            agentId,
            agent,
            productImage,
            architecturalPlan,
            structuralPlan,
            electricalPlan,
            mechanicalPlan,
        });
        const savedProduct = await this.productRepo.save(product);
        if (agent.user) {
            await this.mailService.sendProductSubmittedNotification(agent.user, savedProduct);
        }
        return savedProduct;
    }
    async findAll(filterDto) {
        const { page = 1, limit = 10, search, planType, category, buildingGuides, numBedrooms, numBathrooms, numFloors, area, designStyle, minPrice, maxPrice, status, } = filterDto;
        const skip = (page - 1) * limit;
        const queryOptions = {
            relations: ['agent', 'agent.user', 'agent.profile'],
            order: { createdAt: 'DESC' },
            take: limit,
            skip: skip,
        };
        const filters = {};
        if (planType)
            filters.planType = planType;
        if (category) {
            if (category === 'Product Design') {
                filters.category = (0, database_module_2.In)(['Product Design', 'Building Guide']);
            }
            else if (category === 'Building Plans') {
                filters.category = 'Building Plan';
            }
            else if (category === 'Building Guides') {
                filters.category = 'Building Plan';
            }
            else {
                filters.category = category;
            }
        }
        filters.status = status || marketproduct_entity_1.MarketProductStatus.APPROVED;
        if (numBedrooms)
            filters.numBedrooms = numBedrooms;
        if (numBathrooms)
            filters.numBathrooms = numBathrooms;
        if (numFloors)
            filters.numFloors = numFloors;
        if (area)
            filters.area = area;
        if (designStyle)
            filters.designStyle = designStyle;
        if (minPrice !== undefined && maxPrice !== undefined) {
            filters.price = (0, database_module_2.Between)(minPrice, maxPrice);
        }
        else if (minPrice !== undefined) {
            filters.price = (0, database_module_2.Between)(minPrice, 999999999);
        }
        else if (maxPrice !== undefined) {
            filters.price = (0, database_module_2.Between)(0, maxPrice);
        }
        if (buildingGuides) {
            filters.addOns = (0, database_module_2.Like)(`%${buildingGuides}%`);
        }
        if (search) {
            queryOptions.where = [
                { ...filters, title: (0, database_module_2.Like)(`%${search}%`) },
                { ...filters, description: (0, database_module_2.Like)(`%${search}%`) },
            ];
        }
        else {
            queryOptions.where = filters;
        }
        const [data, total] = await this.productRepo.findAndCount(queryOptions);
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
    async findAllByAgent(agentId, filterDto) {
        const { page = 1, limit = 10, search, planType, category, buildingGuides, numBedrooms, numBathrooms, numFloors, area, designStyle, minPrice, maxPrice, status, } = filterDto;
        const skip = (page - 1) * limit;
        const queryOptions = {
            relations: ['agent', 'agent.user', 'agent.profile'],
            order: { createdAt: 'DESC' },
            take: limit,
            skip: skip,
        };
        const filters = { agentId };
        if (planType)
            filters.planType = planType;
        if (category)
            filters.category = category;
        if (status)
            filters.status = status;
        if (numBedrooms)
            filters.numBedrooms = numBedrooms;
        if (numBathrooms)
            filters.numBathrooms = numBathrooms;
        if (numFloors)
            filters.numFloors = numFloors;
        if (area)
            filters.area = area;
        if (designStyle)
            filters.designStyle = designStyle;
        if (minPrice !== undefined && maxPrice !== undefined) {
            filters.price = (0, database_module_2.Between)(minPrice, maxPrice);
        }
        else if (minPrice !== undefined) {
            filters.price = (0, database_module_2.Between)(minPrice, 999999999);
        }
        else if (maxPrice !== undefined) {
            filters.price = (0, database_module_2.Between)(0, maxPrice);
        }
        if (buildingGuides) {
            filters.addOns = (0, database_module_2.Like)(`%${buildingGuides}%`);
        }
        if (search) {
            queryOptions.where = [
                { ...filters, title: (0, database_module_2.Like)(`%${search}%`) },
                { ...filters, description: (0, database_module_2.Like)(`%${search}%`) },
            ];
        }
        else {
            queryOptions.where = filters;
        }
        const [data, total] = await this.productRepo.findAndCount(queryOptions);
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
        const product = await this.productRepo.findOne({
            where: { id },
            relations: ['agent', 'agent.user', 'agent.profile'],
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }
    async update(id, updateMarketproductDto, files) {
        const product = await this.findOne(id);
        const oldStatus = product.status;
        Object.assign(product, updateMarketproductDto);
        const parseFieldUrls = (dtoField) => {
            if (Array.isArray(dtoField))
                return dtoField;
            if (typeof dtoField === 'string' && dtoField.trim().length > 0) {
                return dtoField.includes(',')
                    ? dtoField.split(',').map((s) => s.trim())
                    : [dtoField.trim()];
            }
            return [];
        };
        const newImages = files?.productImage?.map((f) => f.location) || [];
        const existingImages = parseFieldUrls(updateMarketproductDto.productImage);
        if (newImages.length > 0 ||
            updateMarketproductDto.productImage !== undefined) {
            product.productImage = [...existingImages, ...newImages];
        }
        const newArch = files?.architecturalPlan?.map((f) => f.location) || [];
        const existingArch = parseFieldUrls(updateMarketproductDto.architecturalPlan);
        if (newArch.length > 0 ||
            updateMarketproductDto.architecturalPlan !== undefined) {
            product.architecturalPlan = [...existingArch, ...newArch];
        }
        const newStruct = files?.structuralPlan?.map((f) => f.location) || [];
        const existingStruct = parseFieldUrls(updateMarketproductDto.structuralPlan);
        if (newStruct.length > 0 ||
            updateMarketproductDto.structuralPlan !== undefined) {
            product.structuralPlan = [...existingStruct, ...newStruct];
        }
        const newElect = files?.electricalPlan?.map((f) => f.location) || [];
        const existingElect = parseFieldUrls(updateMarketproductDto.electricalPlan);
        if (newElect.length > 0 ||
            updateMarketproductDto.electricalPlan !== undefined) {
            product.electricalPlan = [...existingElect, ...newElect];
        }
        const newMech = files?.mechanicalPlan?.map((f) => f.location) || [];
        const existingMech = parseFieldUrls(updateMarketproductDto.mechanicalPlan);
        if (newMech.length > 0 ||
            updateMarketproductDto.mechanicalPlan !== undefined) {
            product.mechanicalPlan = [...existingMech, ...newMech];
        }
        const updatedProduct = await this.productRepo.save(product);
        if (oldStatus !== marketproduct_entity_1.MarketProductStatus.APPROVED &&
            updatedProduct.status === marketproduct_entity_1.MarketProductStatus.APPROVED) {
            const agent = await this.agentRepo.findOne({
                where: { id: updatedProduct.agentId },
                relations: ['user'],
            });
            if (agent && agent.user) {
                await this.notificationService.createNotification(agent.user.id, notification_entity_1.NotificationType.PRODUCT, 'Product Approved', `Your product "${updatedProduct.title}" has been approved by admin.`, { productId: updatedProduct.id }, 'projectStatusChanged');
            }
        }
        return updatedProduct;
    }
    async remove(id) {
        const product = await this.findOne(id);
        await this.productRepo.remove(product);
        return { success: true, message: 'Product deleted' };
    }
    async rateProduct(userId, productId, dto) {
        const product = await this.findOne(productId);
        let rating = await this.ratingRepo.findOne({
            where: { userId, productId },
        });
        if (rating) {
            rating.rating = dto.rating;
            rating.comment = dto.comment;
        }
        else {
            rating = this.ratingRepo.create({
                userId,
                productId,
                ...dto,
            });
        }
        await this.ratingRepo.save(rating);
        const [ratings, count] = await this.ratingRepo.findAndCount({
            where: { productId },
        });
        const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
        product.averageRating = count > 0 ? totalRating / count : 0;
        product.ratingCount = count;
        await this.productRepo.save(product);
        return rating;
    }
};
exports.MarketproductService = MarketproductService;
exports.MarketproductService = MarketproductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, database_module_1.InjectRepository)(marketproduct_entity_1.MarketProduct)),
    __param(1, (0, database_module_1.InjectRepository)(agent_entity_1.Agent)),
    __param(2, (0, database_module_1.InjectRepository)(rating_entity_1.Rating)),
    __metadata("design:paramtypes", [Object, Object, Object, mail_service_1.MarketProductMailService,
        notification_service_1.NotificationService])
], MarketproductService);
//# sourceMappingURL=marketproduct.service.js.map