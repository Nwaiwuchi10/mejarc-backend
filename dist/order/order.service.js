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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("../database/database.module");
const order_entity_1 = require("./entities/order.entity");
const order_item_entity_1 = require("./entities/order-item.entity");
const marketproduct_entity_1 = require("../marketproduct/entities/marketproduct.entity");
const user_entity_1 = require("../user/entities/user.entity");
const config_1 = require("@nestjs/config");
const paystack_service_1 = require("./paystack.service");
const paystack_payment_dto_1 = require("./dto/paystack-payment.dto");
const axios_1 = require("axios");
const admin_entity_1 = require("../admin/entities/admin.entity");
const mail_service_1 = require("./Services/mail.service");
const uuid_1 = require("uuid");
const client_s3_1 = require("@aws-sdk/client-s3");
const aws_s3_config_1 = require("../utils/aws-s3.config");
const wallet_entity_1 = require("../wallet/entities/wallet.entity");
const wallet_transaction_entity_1 = require("../wallet/entities/wallet-transaction.entity");
const notification_service_1 = require("../notification/notification.service");
const notification_entity_1 = require("../notification/entities/notification.entity");
let OrderService = class OrderService {
    constructor(orderRepository, orderItemRepository, adminRepository, productRepository, userRepository, walletTransactionRepository, configService, paystackService, mailService, notificationService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.adminRepository = adminRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.walletTransactionRepository = walletTransactionRepository;
        this.configService = configService;
        this.paystackService = paystackService;
        this.mailService = mailService;
        this.notificationService = notificationService;
        this.logger = new common_1.Logger(paystack_service_1.PaystackService.name);
        this.PAYSTACK_VERIFY_URL = 'https://api.paystack.co/transaction/verify';
    }
    async createOrder(createOrderDTO, userId) {
        const { orderItems = [], redirect_url, email, billingInfo, } = createOrderDTO;
        let userEmail;
        let userFirstName = '';
        let userLastName = '';
        if (userId) {
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user)
                throw new common_1.BadRequestException(`User with ID ${userId} not found`);
            userEmail = user.email;
            userFirstName = user.firstName;
            userLastName = user.lastName;
        }
        else {
            if (!email)
                throw new common_1.BadRequestException('Email is required for guest checkout.');
            userEmail = email;
        }
        let grandTotal = 0;
        const validatedOrderItems = [];
        if (orderItems.length > 0) {
            for (const item of orderItems) {
                const product = await this.productRepository.findOne({
                    where: { id: item.productId },
                });
                if (!product)
                    throw new common_1.BadRequestException(`Product with ID ${item.productId} not found`);
                const totalPrice = Number(product.price) * item.totalQuantity;
                grandTotal += totalPrice;
                validatedOrderItems.push({
                    productId: item.productId,
                    totalQuantity: item.totalQuantity,
                    totalPrice,
                    title: product.title,
                });
            }
        }
        if (validatedOrderItems.length === 0) {
            throw new common_1.BadRequestException('You must select a product.');
        }
        const paystackResponse = await this.paystackService.initializePayment(userId || null, grandTotal, redirect_url, userEmail);
        if (!paystackResponse?.data?.reference) {
            throw new common_1.BadRequestException('Failed to generate Paystack payment reference.');
        }
        const newOrder = this.orderRepository.create({
            userId: userId || undefined,
            grandTotal,
            redirect_url,
            billingInfo,
            payStackPayment: {
                userId: userId || undefined,
                email: userEmail,
                reference: paystackResponse.data.reference,
                authorization_url: paystackResponse.data.authorization_url,
                access_code: paystackResponse.data.access_code,
                amount: grandTotal,
                transactionStatus: 'pending',
                status: 'notPaid',
                orderItems: validatedOrderItems,
                metadata: paystackResponse.metadata,
            },
        });
        await this.orderRepository.save(newOrder);
        const orderItemsToSave = validatedOrderItems.map((item) => {
            const orderItem = new order_item_entity_1.OrderItem();
            orderItem.order = newOrder;
            orderItem.productId = item.productId;
            orderItem.totalQuantity = item.totalQuantity;
            orderItem.totalPrice = item.totalPrice;
            return orderItem;
        });
        await this.orderItemRepository.save(orderItemsToSave);
        try {
            await this.mailService.ConfirmOrder(userEmail, userFirstName, userLastName, grandTotal, paystackResponse.data.reference, validatedOrderItems);
        }
        catch (error) {
            this.logger.error(`Failed to send email to ${userEmail}`, error);
        }
        return {
            message: 'Order created successfully, complete payment using Paystack',
            reference: paystackResponse.data.reference,
            access_code: paystackResponse.data.access_code,
            authorization_url: paystackResponse.data.authorization_url,
            orderId: newOrder.id,
            orderItems: validatedOrderItems,
            redirect_url,
            userId: userId || null,
            email: userEmail,
            amount: grandTotal,
            billingInfo,
            metadata: paystackResponse.metadata,
        };
    }
    async verifyPaystackPayment(reference) {
        try {
            const response = await axios_1.default.get(`${this.PAYSTACK_VERIFY_URL}/${reference}`, {
                headers: {
                    Authorization: `Bearer ${this.configService.get('PAYSTACK_SECRET_KEY')}`,
                },
            });
            const data = response.data.data;
            if (data.status !== 'success')
                throw new common_1.BadRequestException('Payment verification failed.');
            const order = await this.orderRepository
                .createQueryBuilder('order')
                .where(`"order"."payStackPayment"->>'reference' = :reference`, {
                reference,
            })
                .getOne();
            if (!order)
                throw new common_1.BadRequestException(`Order with reference ${reference} not found.`);
            if (order.isPaid) {
                return {
                    message: 'Payment already verified',
                    orderId: order.id,
                    reference: order.payStackPayment.reference,
                    amountPaid: order.amountPaid,
                    status: order.payStackPayment.status,
                    redirectUrl: order.redirect_url || null,
                };
            }
            const customerEmail = data.customer?.email;
            if (!customerEmail)
                throw new common_1.BadRequestException('Customer email not found from Paystack response.');
            let user = await this.userRepository.findOne({
                where: { email: customerEmail },
            });
            if (!user) {
                const generatedPassword = (0, uuid_1.v4)().slice(0, 10);
                user = this.userRepository.create({
                    email: customerEmail,
                    password: generatedPassword,
                    firstName: 'New',
                    lastName: 'User',
                });
                await this.userRepository.save(user);
                try {
                    await this.mailService.sendAccountCreatedMail(user.email, generatedPassword);
                }
                catch (error) {
                    console.error('Failed to send account creation mail', error.message);
                }
            }
            const amountInNaira = data.amount / 100;
            order.isPaid = true;
            order.payStackPayment = {
                ...order.payStackPayment,
                status: paystack_payment_dto_1.PaymentStatus.paid,
                transactionStatus: data.status,
            };
            order.amountPaid = amountInNaira.toString();
            order.grandTotal = amountInNaira;
            order.userId = user.id;
            await this.orderRepository.save(order);
            const admins = await this.adminRepository.find({ relations: ['user'] });
            for (const admin of admins) {
                if (admin.user) {
                    await this.notificationService.createNotification(admin.user.id, notification_entity_1.NotificationType.ORDER, 'New Order Payment', `An order has been paid successfully. Total: ₦${order.grandTotal}`, { orderId: order.id }, 'messagesAdmin');
                }
            }
            const orderDetails = await this.orderRepository.findOne({
                where: { id: order.id },
                relations: ['user', 'orderItems', 'orderItems.product'],
            });
            if (orderDetails && orderDetails.orderItems?.length > 0) {
                for (const item of orderDetails.orderItems) {
                    const product = await this.productRepository.findOne({
                        where: { id: item.productId },
                        relations: ['agent', 'agent.wallet'],
                    });
                    if (product && product.agent) {
                        let wallet = product.agent.wallet;
                        if (!wallet) {
                            wallet = new wallet_entity_1.Wallet();
                            wallet.agent = product.agent;
                            wallet.balance = 0;
                            wallet.lifetimeEarnings = 0;
                            wallet.pendingClearance = 0;
                            await this.orderRepository.manager.save(wallet);
                            this.logger.log(`Created new wallet for agent ${product.agent.id}`);
                        }
                        const productTotal = Number(product.price) * (item.totalQuantity || 1);
                        const agentShare = productTotal * 0.9;
                        wallet.balance = Number(wallet.balance) + agentShare;
                        wallet.lifetimeEarnings =
                            Number(wallet.lifetimeEarnings) + agentShare;
                        await this.orderRepository.manager.save(wallet);
                        const transactionRecord = this.walletTransactionRepository.create({
                            type: wallet_transaction_entity_1.TransactionType.CREDIT,
                            category: wallet_transaction_entity_1.TransactionCategory.PRODUCT_SALE,
                            amount: agentShare,
                            balanceAfter: wallet.balance,
                            description: `Product Sale - ${product.title}`,
                            wallet: wallet,
                        });
                        await this.walletTransactionRepository.save(transactionRecord);
                        if (product.agent.user) {
                            await this.notificationService.createNotification(product.agent.user.id, notification_entity_1.NotificationType.PRODUCTPAYMENT, 'Product Sold', `Your product "${product.title}" has been sold. ₦${agentShare} has been credited to your wallet.`, { productId: product.id, orderId: order.id }, 'messagesAgent');
                            await this.notificationService.createNotification(product.agent.user.id, notification_entity_1.NotificationType.WALLET, 'Wallet Credited', `₦${agentShare} has been added to your wallet from sale of "${product.title}".`, { amount: agentShare }, 'paymentSuccessful');
                        }
                    }
                }
            }
            try {
                await this.mailService.VerifyOrder(user.email, user.firstName, user.lastName, amountInNaira, reference, data.status, orderDetails?.orderItems);
            }
            catch (err) {
                console.error(`Failed to send payment confirmation email to ${user.email}`);
            }
            try {
                if (orderDetails) {
                    await this.mailService.Invoice(user.email, user.firstName, user.lastName, order.grandTotal, reference, data.status, orderDetails.orderItems, null, orderDetails.createdAt);
                }
            }
            catch (err) {
                console.error(`Failed to send invoice to ${user.email}`);
            }
            try {
                if (orderDetails) {
                    await this.mailService.notifyAdminOfInvoice(user.email, user.firstName, user.lastName, order.grandTotal, reference, 'success', orderDetails.orderItems, null, orderDetails.createdAt);
                }
            }
            catch (error) {
                console.error(`Failed to send invoice to Admin`);
            }
            try {
                if (orderDetails && orderDetails.orderItems?.length > 0) {
                    await this.mailService.sendProductDeliveryMail(user.email, user.firstName, orderDetails.orderItems, orderDetails);
                }
            }
            catch (error) {
                console.error(`Failed to send product delivery email to User ${user.email}`, error);
            }
            try {
                if (orderDetails && orderDetails.orderItems?.length > 0) {
                    for (const item of orderDetails.orderItems) {
                        const product = await this.productRepository.findOne({
                            where: { id: item.productId },
                            relations: ['agent', 'agent.user'],
                        });
                        if (product && product.agent && product.agent.user) {
                            const productTotal = Number(product.price) * (item.totalQuantity || 1);
                            const agentShare = productTotal * 0.9;
                            await this.mailService.notifyAgentOfProductSale(product.agent.user.email, product.agent.user.firstName || 'Agent', product.title, agentShare);
                        }
                    }
                }
            }
            catch (error) {
                console.error(`Failed to send sale notification to Agent`, error);
            }
            return {
                message: 'Payment verified successfully',
                orderId: order.id,
                reference: order.payStackPayment.reference,
                amountPaid: order.amountPaid,
                status: order.payStackPayment.status,
                redirectUrl: order.redirect_url || null,
                userId: order?.userId,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException({
                message: 'System error: ' + error.message,
                originalError: error.toString(),
                stack: error.stack,
                isNestException: error instanceof common_1.BadRequestException,
                errorResponse: error.response,
            });
        }
    }
    async handlePaystackWebhook(payload) {
        const { event, data } = payload;
        if (event !== 'charge.success')
            return;
        const reference = data.reference;
        const order = await this.orderRepository
            .createQueryBuilder('order')
            .where(`"order"."payStackPayment"->>'reference' = :reference`, {
            reference,
        })
            .getOne();
        if (!order || order.isPaid)
            return;
        try {
            return await this.verifyPaystackPayment(reference);
        }
        catch (error) {
            console.error('Webhook verification failed:', error.message);
            return;
        }
    }
    async handlePaystackWebhookFunction(payload) {
        return this.handlePaystackWebhook(payload);
    }
    async verifyPaystackPaymentPreviousFlow(reference) {
        return this.verifyPaystackPayment(reference);
    }
    async handlePaystackWebhookStandaloneFuction(payload) {
        return this.handlePaystackWebhook(payload);
    }
    async verifyPaystackPaymentss(reference) {
        return this.verifyPaystackPayment(reference);
    }
    async verifyPaystackPaymentWithoutMailInvoice(reference) {
        return this.verifyPaystackPayment(reference);
    }
    async findOrderDetails(id) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: [
                'user',
                'orderItems',
                'orderItems.product',
                'orderItems.product.agent',
                'orderItems.product.agent.user',
            ],
        });
        if (!order)
            throw new common_1.BadRequestException(`Order with ${id} not found`);
        if (order.user)
            delete order.user.password;
        return { order };
    }
    async findAllOrderPagination(query) {
        const resPerPage = 10;
        const currentPage = Number(query.page) || 1;
        const skip = resPerPage * (currentPage - 1);
        return this.orderRepository.find({
            order: { createdAt: 'DESC' },
            take: resPerPage,
            skip,
            relations: [
                'user',
                'orderItems',
                'orderItems.product',
                'orderItems.product.agent',
                'orderItems.product.agent.user',
            ],
        });
    }
    async findAllApprovedOrderPagination(query) {
        const resPerPage = 10;
        const currentPage = Number(query.page) || 1;
        const skip = resPerPage * (currentPage - 1);
        return this.orderRepository.find({
            where: { isPaid: true },
            order: { createdAt: 'DESC' },
            take: resPerPage,
            skip,
            relations: [
                'user',
                'orderItems',
                'orderItems.product',
                'orderItems.product.agent',
                'orderItems.product.agent.user',
            ],
        });
    }
    async findLoginUserAllApprovedOrderPagination(query, userId) {
        const resPerPage = 10;
        const currentPage = Number(query.page) || 1;
        const skip = resPerPage * (currentPage - 1);
        return this.orderRepository.find({
            where: { userId, isPaid: true },
            order: { createdAt: 'DESC' },
            take: resPerPage,
            skip,
            relations: [
                'user',
                'orderItems',
                'orderItems.product',
                'orderItems.product.agent',
                'orderItems.product.agent.user',
            ],
        });
    }
    async findAllNotApprovedOrderPagination(query) {
        const resPerPage = 10;
        const currentPage = Number(query.page) || 1;
        const skip = resPerPage * (currentPage - 1);
        return this.orderRepository.find({
            where: { isPaid: false },
            order: { createdAt: 'DESC' },
            take: resPerPage,
            skip,
            relations: [
                'user',
                'orderItems',
                'orderItems.product',
                'orderItems.product.agent',
                'orderItems.product.agent.user',
            ],
        });
    }
    async findLoginUserAllNotApprovedOrderPagination(query, userId) {
        const resPerPage = 10;
        const currentPage = Number(query.page) || 1;
        const skip = resPerPage * (currentPage - 1);
        return this.orderRepository.find({
            where: { userId, isPaid: false },
            order: { createdAt: 'DESC' },
            take: resPerPage,
            skip,
            relations: [
                'user',
                'orderItems',
                'orderItems.product',
                'orderItems.product.agent',
                'orderItems.product.agent.user',
            ],
        });
    }
    async findAllLoginUserOrderPagination(query, userId) {
        const resPerPage = 10;
        const currentPage = Number(query.page) || 1;
        const skip = resPerPage * (currentPage - 1);
        return this.orderRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: resPerPage,
            skip,
            relations: [
                'user',
                'orderItems',
                'orderItems.product',
                'orderItems.product.agent',
                'orderItems.product.agent.user',
            ],
        });
    }
    async findAllUserOrderPagination(query, userId) {
        return this.findAllLoginUserOrderPagination(query, userId);
    }
    async findAll() {
        return this.orderRepository.find({
            relations: [
                'user',
                'orderItems',
                'orderItems.product',
                'orderItems.product.agent',
                'orderItems.product.agent.user',
            ],
        });
    }
    async findOne(id) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: [
                'user',
                'orderItems',
                'orderItems.product',
                'orderItems.product.agent',
                'orderItems.product.agent.user',
            ],
        });
        if (!order)
            throw new common_1.BadRequestException(`Order with ${id} not found`);
        return { order };
    }
    async addComment(id, addCommentDto, userId) {
        const order = await this.orderRepository.findOne({ where: { id } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        const customer = await this.orderRepository.findOne({ where: { userId } });
        const adminUser = await this.adminRepository.findOne({ where: { userId } });
        if (!customer && !adminUser)
            throw new common_1.NotFoundException('Only Admin & Customer for the order is permitted to add a comment');
        let PicsUrl;
        if (addCommentDto.fileUrl) {
            if (addCommentDto.fileUrl.startsWith('data:')) {
                const matches = addCommentDto.fileUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                if (matches && matches.length === 3) {
                    try {
                        const buffer = Buffer.from(matches[2], 'base64');
                        const fileName = `orderComment_${Date.now()}.jpg`;
                        const command = new client_s3_1.PutObjectCommand({
                            Bucket: aws_s3_config_1.AWS_S3_BUCKET_NAME,
                            Key: `Order/${fileName}`,
                            Body: buffer,
                            ContentType: matches[1],
                        });
                        await aws_s3_config_1.s3Client.send(command);
                        PicsUrl = `https://${aws_s3_config_1.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/Order/${fileName}`;
                        addCommentDto.fileUrl = PicsUrl;
                    }
                    catch (error) {
                        console.error('Error uploading to S3:', error);
                        throw new common_1.BadRequestException('Error uploading order picture');
                    }
                }
            }
            else {
                PicsUrl = addCommentDto.fileUrl;
            }
        }
        const newComment = {
            userId,
            commentText: addCommentDto.commentText,
            fileUrl: addCommentDto.fileUrl,
            createdAt: new Date(),
        };
        order.comments = [...(order.comments || []), newComment];
        return this.orderRepository.save(order);
    }
    update(id, updateOrderDto) {
        return `This action updates a #${id} order`;
    }
    remove(id) {
        return `This action removes a #${id} order`;
    }
    async addCommentFormData(id, addCommentDto, userId, file) {
        const order = await this.orderRepository.findOne({ where: { id } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        const customer = await this.orderRepository.findOne({ where: { userId } });
        const adminUser = await this.adminRepository.findOne({ where: { userId } });
        if (!customer && !adminUser)
            throw new common_1.NotFoundException('Only Admin & Customer for the order is permitted to add a comment');
        if (file) {
            try {
                const filePath = `${process.env.Base_Url || process.env.Base_Url_Local}/uploads/${file.filename}`;
                addCommentDto.fileUrl = filePath;
            }
            catch (error) {
                throw new common_1.BadRequestException('Error saving file(s)');
            }
        }
        const newComment = {
            userId,
            commentText: addCommentDto.commentText,
            fileUrl: addCommentDto.fileUrl,
            createdAt: new Date(),
        };
        order.comments = [...(order.comments || []), newComment];
        return this.orderRepository.save(order);
    }
    async addCommentFormDataCLOUD(id, addCommentDto, userId, file) {
        const order = await this.orderRepository.findOne({ where: { id } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
        const customer = await this.orderRepository.findOne({ where: { userId } });
        const adminUser = await this.adminRepository.findOne({ where: { userId } });
        if (!customer && !adminUser)
            throw new common_1.NotFoundException('Only Admin & Customer for the order is permitted to add a comment');
        let imgUrl;
        if (file) {
            try {
                const fileName = `orderComment_${Date.now()}_${file.originalname}`;
                const command = new client_s3_1.PutObjectCommand({
                    Bucket: aws_s3_config_1.AWS_S3_BUCKET_NAME,
                    Key: `Order/${fileName}`,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                });
                if (aws_s3_config_1.s3Client) {
                    await aws_s3_config_1.s3Client.send(command);
                }
                else {
                    throw new Error('S3 Client is not initialized');
                }
                imgUrl = `https://${aws_s3_config_1.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/Order/${fileName}`;
            }
            catch (error) {
                throw new common_1.BadRequestException('Error uploading order picture');
            }
        }
        const newComment = {
            userId,
            commentText: addCommentDto.commentText,
            fileUrl: imgUrl,
            createdAt: new Date(),
        };
        order.comments = [...(order.comments || []), newComment];
        return this.orderRepository.save(order);
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, database_module_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, database_module_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __param(2, (0, database_module_1.InjectRepository)(admin_entity_1.Admin)),
    __param(3, (0, database_module_1.InjectRepository)(marketproduct_entity_1.MarketProduct)),
    __param(4, (0, database_module_1.InjectRepository)(user_entity_1.User)),
    __param(5, (0, database_module_1.InjectRepository)(wallet_transaction_entity_1.WalletTransaction)),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, config_1.ConfigService,
        paystack_service_1.PaystackService,
        mail_service_1.MailService,
        notification_service_1.NotificationService])
], OrderService);
//# sourceMappingURL=order.service.js.map