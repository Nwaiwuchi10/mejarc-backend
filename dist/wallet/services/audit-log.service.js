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
exports.AuditLogService = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("../../database/database.module");
const withdrawal_audit_log_entity_1 = require("../entities/withdrawal-audit-log.entity");
let AuditLogService = class AuditLogService {
    constructor(auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }
    async logAction(action, data) {
        const auditLog = this.auditLogRepository.create({
            action,
            agentId: data.agentId,
            withdrawalId: data.withdrawalId,
            adminId: data.adminId,
            amount: data.amount,
            description: data.description,
            paystackReference: data.paystackReference,
            paystackTransferCode: data.paystackTransferCode,
            ipAddress: data.ipAddress,
            userAgent: data.userAgent,
            metadata: data.metadata,
        });
        return await this.auditLogRepository.save(auditLog);
    }
    async getWithdrawalAuditLogs(withdrawalId) {
        return this.auditLogRepository.find({
            where: { withdrawalId },
            order: { createdAt: 'ASC' },
            relations: ['agent', 'admin'],
        });
    }
    async getAgentAuditLogs(agentId, limit = 100) {
        return this.auditLogRepository.find({
            where: { agentId },
            order: { createdAt: 'DESC' },
            take: limit,
            relations: ['withdrawal'],
        });
    }
    async getAllAuditLogs(skip = 0, take = 100) {
        const [data, total] = await this.auditLogRepository.findAndCount({
            order: { createdAt: 'DESC' },
            skip,
            take,
            relations: ['agent', 'admin', 'withdrawal'],
        });
        return { data, total };
    }
    async getLogsByAction(action, skip = 0, take = 100) {
        return this.auditLogRepository.find({
            where: { action },
            order: { createdAt: 'DESC' },
            skip,
            take,
            relations: ['agent', 'admin'],
        });
    }
    async getLogsByDateRange(startDate, endDate, skip = 0, take = 100) {
        const [data, total] = await this.auditLogRepository.findAndCount({
            where: {
                createdAt: {
                    raw: `BETWEEN '${startDate.toISOString()}' AND '${endDate.toISOString()}'`,
                },
            },
            order: { createdAt: 'DESC' },
            skip,
            take,
            relations: ['agent', 'admin'],
        });
        return { data, total };
    }
};
exports.AuditLogService = AuditLogService;
exports.AuditLogService = AuditLogService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, database_module_1.InjectRepository)(withdrawal_audit_log_entity_1.WithdrawalAuditLog)),
    __metadata("design:paramtypes", [Object])
], AuditLogService);
//# sourceMappingURL=audit-log.service.js.map