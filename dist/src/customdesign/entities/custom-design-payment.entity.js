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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomDesignPayment = exports.CustomDesignPaymentStatus = void 0;
const openapi = require("@nestjs/swagger");
const database_module_1 = require("../../database/database.module");
const customdesign_entity_1 = require("../../customdesign/entities/customdesign.entity");
const user_entity_1 = require("../../user/entities/user.entity");
var CustomDesignPaymentStatus;
(function (CustomDesignPaymentStatus) {
    CustomDesignPaymentStatus["PENDING_AGREEMENT"] = "Pending Agreement";
    CustomDesignPaymentStatus["AWAITING_PAYMENT"] = "Awaiting Payment";
    CustomDesignPaymentStatus["PAID"] = "Paid";
    CustomDesignPaymentStatus["FAILED"] = "Failed";
})(CustomDesignPaymentStatus || (exports.CustomDesignPaymentStatus = CustomDesignPaymentStatus = {}));
let CustomDesignPayment = class CustomDesignPayment {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, agreedPrice: { required: true, type: () => Number }, status: { required: true, enum: require("./custom-design-payment.entity").CustomDesignPaymentStatus }, paystackData: { required: true, type: () => Object }, isConfirmedByAgent: { required: true, type: () => Boolean }, customDesign: { required: true, type: () => require("./customdesign.entity").CustomDesign }, customDesignId: { required: true, type: () => String }, user: { required: true, type: () => require("../../user/entities/user.entity").User }, userId: { required: true, type: () => String }, amountPaid: { required: true, type: () => Number }, paidAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.CustomDesignPayment = CustomDesignPayment;
__decorate([
    (0, database_module_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CustomDesignPayment.prototype, "id", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'decimal', precision: 15, scale: 2 }),
    __metadata("design:type", Number)
], CustomDesignPayment.prototype, "agreedPrice", void 0);
__decorate([
    (0, database_module_1.Column)({
        type: 'enum',
        enum: CustomDesignPaymentStatus,
        default: CustomDesignPaymentStatus.PENDING_AGREEMENT,
    }),
    __metadata("design:type", String)
], CustomDesignPayment.prototype, "status", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], CustomDesignPayment.prototype, "paystackData", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], CustomDesignPayment.prototype, "isConfirmedByAgent", void 0);
__decorate([
    (0, database_module_1.OneToOne)(() => customdesign_entity_1.CustomDesign, { onDelete: 'CASCADE' }),
    (0, database_module_1.JoinColumn)({ name: 'customDesignId' }),
    __metadata("design:type", customdesign_entity_1.CustomDesign)
], CustomDesignPayment.prototype, "customDesign", void 0);
__decorate([
    (0, database_module_1.Column)('uuid'),
    __metadata("design:type", String)
], CustomDesignPayment.prototype, "customDesignId", void 0);
__decorate([
    (0, database_module_1.ManyToOne)(() => user_entity_1.User, { onDelete: 'CASCADE' }),
    (0, database_module_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], CustomDesignPayment.prototype, "user", void 0);
__decorate([
    (0, database_module_1.Column)('uuid'),
    __metadata("design:type", String)
], CustomDesignPayment.prototype, "userId", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'decimal', precision: 15, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], CustomDesignPayment.prototype, "amountPaid", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], CustomDesignPayment.prototype, "paidAt", void 0);
__decorate([
    (0, database_module_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CustomDesignPayment.prototype, "createdAt", void 0);
__decorate([
    (0, database_module_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], CustomDesignPayment.prototype, "updatedAt", void 0);
exports.CustomDesignPayment = CustomDesignPayment = __decorate([
    (0, database_module_1.Entity)('custom_design_payments')
], CustomDesignPayment);
//# sourceMappingURL=custom-design-payment.entity.js.map