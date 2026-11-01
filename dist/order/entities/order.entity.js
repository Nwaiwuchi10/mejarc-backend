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
exports.Order = exports.BillingInfo = exports.PaymentStatus = void 0;
const openapi = require("@nestjs/swagger");
const database_module_1 = require("../../database/database.module");
const user_entity_1 = require("../../user/entities/user.entity");
const order_item_entity_1 = require("./order-item.entity");
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["paid"] = "paid";
    PaymentStatus["notPaid"] = "not paid";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
class BillingInfo {
    static _OPENAPI_METADATA_FACTORY() {
        return { firstName: { required: false, type: () => String }, lastName: { required: false, type: () => String }, email: { required: false, type: () => String }, phone: { required: false, type: () => String }, country: { required: false, type: () => String }, city: { required: false, type: () => String }, postalCode: { required: false, type: () => String }, state: { required: false, type: () => String }, address: { required: false, type: () => String }, date: { required: false, type: () => Date } };
    }
}
exports.BillingInfo = BillingInfo;
let Order = class Order {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, user: { required: true, type: () => require("../../user/entities/user.entity").User }, userId: { required: true, type: () => String }, paymentMethod: { required: true, type: () => String }, orderItems: { required: true, type: () => [require("./order-item.entity").OrderItem] }, billingInfo: { required: true, type: () => require("./order.entity").BillingInfo }, payStackPayment: { required: true, type: () => Object }, redirect_url: { required: true, type: () => String }, isPaid: { required: true, type: () => Boolean }, deliveryStatus: { required: true, type: () => Object }, grandTotal: { required: true, type: () => Number }, projectDsc: { required: true, type: () => String }, comments: { required: true, type: () => [Object] }, deliveryComment: { required: true, type: () => [Object] }, amountPaid: { required: true, type: () => String }, date: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.Order = Order;
__decorate([
    (0, database_module_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Order.prototype, "id", void 0);
__decorate([
    (0, database_module_1.ManyToOne)(() => user_entity_1.User, { nullable: true, onDelete: 'SET NULL' }),
    (0, database_module_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", user_entity_1.User)
], Order.prototype, "user", void 0);
__decorate([
    (0, database_module_1.Column)('uuid', { nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "userId", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "paymentMethod", void 0);
__decorate([
    (0, database_module_1.OneToMany)(() => order_item_entity_1.OrderItem, (orderItem) => orderItem.order, { cascade: true }),
    __metadata("design:type", Array)
], Order.prototype, "orderItems", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", BillingInfo)
], Order.prototype, "billingInfo", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Order.prototype, "payStackPayment", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "redirect_url", void 0);
__decorate([
    (0, database_module_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Order.prototype, "isPaid", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Order.prototype, "deliveryStatus", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'decimal', precision: 15, scale: 2, default: 0.0 }),
    __metadata("design:type", Number)
], Order.prototype, "grandTotal", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "projectDsc", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'jsonb', default: [] }),
    __metadata("design:type", Array)
], Order.prototype, "comments", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'jsonb', default: [] }),
    __metadata("design:type", Array)
], Order.prototype, "deliveryComment", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "amountPaid", void 0);
__decorate([
    (0, database_module_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "date", void 0);
__decorate([
    (0, database_module_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Order.prototype, "createdAt", void 0);
__decorate([
    (0, database_module_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Order.prototype, "updatedAt", void 0);
exports.Order = Order = __decorate([
    (0, database_module_1.Entity)('orders')
], Order);
//# sourceMappingURL=order.entity.js.map