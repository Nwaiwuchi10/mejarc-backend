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
exports.OrderController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const order_service_1 = require("./order.service");
const create_order_dto_1 = require("./dto/create-order.dto");
const update_order_dto_1 = require("./dto/update-order.dto");
const user_guard_1 = require("../user/guard/user.guard");
const AddOrderComment_dto_1 = require("./dto/AddOrderComment.dto");
const platform_express_1 = require("@nestjs/platform-express");
const crypto = require("crypto");
const config_1 = require("@nestjs/config");
let OrderController = class OrderController {
    constructor(orderService, configService) {
        this.orderService = orderService;
        this.configService = configService;
    }
    async createOrder(createOrderDTO, req) {
        const userId = req.userId || null;
        return this.orderService.createOrder(createOrderDTO, userId);
    }
    async handlePaystackWebhook(req, res) {
        const secret = this.configService.get('PAYSTACK_SECRET_KEY') || '';
        const allowedSource = this.configService.get('Forwarded_From');
        const forwardedFrom = req.headers['forwarded-from'] || req.headers['Forwarded-From'];
        if (allowedSource && forwardedFrom !== allowedSource) {
            return res.status(403).send('Invalid source');
        }
        const hash = crypto
            .createHmac('sha512', secret)
            .update(JSON.stringify(req.body))
            .digest('hex');
        const paystackSignature = req.headers['x-paystack-signature'];
        if (hash !== paystackSignature) {
            return res.status(401).send('Unauthorized webhook');
        }
        await this.orderService.handlePaystackWebhook(req.body);
        return res.sendStatus(200);
    }
    async verifyPayment(reference) {
        return this.orderService.verifyPaystackPayment(reference);
    }
    async handlePaystackWebhooks(req, res) {
        const secret = this.configService.get('PAYSTACK_SECRET_KEY') || '';
        const hash = crypto
            .createHmac('sha512', secret)
            .update(JSON.stringify(req.body))
            .digest('hex');
        if (hash !== req.headers['x-paystack-signature'] &&
            !req.headers['X-Paystack-Signature']) {
            return res.status(401).send('Unauthorized webhook');
        }
        await this.orderService.handlePaystackWebhook(req.body);
        return res.sendStatus(200);
    }
    async getAllApprovedOrdersPagination(query) {
        return this.orderService.findAllApprovedOrderPagination(query);
    }
    async getAllNotApprovedOrdersPagination(query) {
        return this.orderService.findAllNotApprovedOrderPagination(query);
    }
    async getLoginUserAllApprovedOrdersPagination(query, req) {
        const userId = req.userId;
        return this.orderService.findLoginUserAllApprovedOrderPagination(query, userId);
    }
    async getLoginUserAllNotApprovedOrdersPagination(query, req) {
        const userId = req.userId;
        return this.orderService.findLoginUserAllNotApprovedOrderPagination(query, userId);
    }
    async getAllOrdersPagination(query) {
        return this.orderService.findAllOrderPagination(query);
    }
    async getAllLoginUserOrderPagination(query, req) {
        const userId = req.userId;
        return this.orderService.findAllLoginUserOrderPagination(query, userId);
    }
    async findAllUserOrderPagination(query, userId) {
        return this.orderService.findAllUserOrderPagination(query, userId);
    }
    findAll() {
        return this.orderService.findAll();
    }
    findOne(id) {
        return this.orderService.findOne(id);
    }
    update(id, updateOrderDto) {
        return this.orderService.update(id, updateOrderDto);
    }
    remove(id) {
        return this.orderService.remove(+id);
    }
    async addComment(id, addCommentDto, req) {
        const userId = req.userId;
        return this.orderService.addComment(id, addCommentDto, userId);
    }
    async addCommentFormData(id, addCommentDto, file, req) {
        const userId = req.userId;
        return this.orderService.addCommentFormDataCLOUD(id, addCommentDto, userId, file);
    }
};
exports.OrderController = OrderController;
__decorate([
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, common_1.Post)('/initialize'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Initialize a new checkout order / payment intent' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Order initialized with payment link / reference',
    }),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ whitelist: true })),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "createOrder", null);
__decorate([
    (0, common_1.Post)('/paystack/webhook'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Handle Paystack payment webhook' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Webhook processed' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "handlePaystackWebhook", null);
__decorate([
    (0, common_1.Get)('/paystack/verify'),
    (0, swagger_1.ApiOperation)({ summary: 'Verify a Paystack payment reference' }),
    (0, swagger_1.ApiQuery)({
        name: 'reference',
        description: 'Paystack transaction reference',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payment verification result' }),
    __param(0, (0, common_1.Query)('reference')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "verifyPayment", null);
__decorate([
    (0, common_1.Post)('/paystack/webhook/test'),
    (0, common_1.HttpCode)(200),
    (0, swagger_1.ApiOperation)({ summary: 'Test Paystack webhook receiver' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Webhook test received' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "handlePaystackWebhooks", null);
__decorate([
    (0, common_1.Get)('approved/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all approved orders with pagination' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Approved orders list' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getAllApprovedOrdersPagination", null);
__decorate([
    (0, common_1.Get)('notapproved/all'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get all pending / non-approved orders with pagination',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Non-approved orders list' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getAllNotApprovedOrdersPagination", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, common_1.Get)('approved/all/user'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user approved orders' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User approved orders' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getLoginUserAllApprovedOrdersPagination", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, common_1.Get)('notapproved/all/user'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current user pending / non-approved orders' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User pending orders' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getLoginUserAllNotApprovedOrdersPagination", null);
__decorate([
    (0, common_1.Get)('pag/all'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all orders with pagination' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paginated orders' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getAllOrdersPagination", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, common_1.Get)('pag/all/user'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all orders of currently logged in user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User paginated orders' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "getAllLoginUserOrderPagination", null);
__decorate([
    (0, common_1.Get)('pag/all/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all orders of a specific user' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User orders' }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "findAllUserOrderPagination", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all orders' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Orders list' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get order by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Order ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update order status / details' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Order ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order updated' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_dto_1.UpdateOrderDto]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete order by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Order ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Order deleted' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrderController.prototype, "remove", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, common_1.Patch)(':id/comment/new'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Add a new comment to an order' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Order ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Comment added' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, AddOrderComment_dto_1.AddCommentDto, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "addComment", null);
__decorate([
    (0, common_1.UseGuards)(user_guard_1.UserAuthGuard),
    (0, common_1.Patch)(':id/comment'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Add comment with file attachment to order' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Order ID' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                fileUrl: {
                    type: 'string',
                    format: 'binary',
                    description: 'Attachment file (max 50MB)',
                },
                comment: {
                    type: 'string',
                    description: 'Comment text',
                    example: 'Please check this revision',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Comment with attachment added' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('fileUrl', {
        limits: { fileSize: 50 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, AddOrderComment_dto_1.AddCommentDto, Object, Object]),
    __metadata("design:returntype", Promise)
], OrderController.prototype, "addCommentFormData", null);
exports.OrderController = OrderController = __decorate([
    (0, swagger_1.ApiTags)('Order'),
    (0, common_1.Controller)('order'),
    __metadata("design:paramtypes", [order_service_1.OrderService,
        config_1.ConfigService])
], OrderController);
//# sourceMappingURL=order.controller.js.map