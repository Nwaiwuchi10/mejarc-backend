import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Repository } from 'src/database/database.module';
import { MarketProduct } from '../marketproduct/entities/marketproduct.entity';
import { User } from '../user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { PaystackService } from './paystack.service';
import { Query } from 'express-serve-static-core';
import { AddCommentDto } from './dto/AddOrderComment.dto';
import { Admin } from '../admin/entities/admin.entity';
import { MailService } from './Services/mail.service';
import { WalletTransaction } from '../wallet/entities/wallet-transaction.entity';
import { NotificationService } from '../notification/notification.service';
export declare class OrderService {
    private readonly orderRepository;
    private readonly orderItemRepository;
    private readonly adminRepository;
    private readonly productRepository;
    private readonly userRepository;
    private readonly walletTransactionRepository;
    private readonly configService;
    private readonly paystackService;
    private mailService;
    private readonly notificationService;
    private readonly logger;
    private PAYSTACK_VERIFY_URL;
    constructor(orderRepository: Repository<Order>, orderItemRepository: Repository<OrderItem>, adminRepository: Repository<Admin>, productRepository: Repository<MarketProduct>, userRepository: Repository<User>, walletTransactionRepository: Repository<WalletTransaction>, configService: ConfigService, paystackService: PaystackService, mailService: MailService, notificationService: NotificationService);
    createOrder(createOrderDTO: CreateOrderDto, userId?: string): Promise<{
        message: string;
        reference: any;
        access_code: any;
        authorization_url: any;
        orderId: any;
        orderItems: any[];
        redirect_url: string;
        userId: string | null;
        email: string;
        amount: number;
        billingInfo: {
            firstName?: string;
            lastName?: string;
            email?: string;
            phone?: string;
            country?: string;
            city?: string;
            postalCode?: string;
            state?: string;
            address?: string;
            date?: Date;
        };
        metadata: any;
    }>;
    verifyPaystackPayment(reference: string): Promise<{
        message: string;
        orderId: any;
        reference: any;
        amountPaid: any;
        status: any;
        redirectUrl: any;
        userId?: undefined;
    } | {
        message: string;
        orderId: any;
        reference: any;
        amountPaid: any;
        status: any;
        redirectUrl: any;
        userId: any;
    }>;
    handlePaystackWebhook(payload: any): Promise<{
        message: string;
        orderId: any;
        reference: any;
        amountPaid: any;
        status: any;
        redirectUrl: any;
        userId?: undefined;
    } | {
        message: string;
        orderId: any;
        reference: any;
        amountPaid: any;
        status: any;
        redirectUrl: any;
        userId: any;
    } | undefined>;
    handlePaystackWebhookFunction(payload: any): Promise<{
        message: string;
        orderId: any;
        reference: any;
        amountPaid: any;
        status: any;
        redirectUrl: any;
        userId?: undefined;
    } | {
        message: string;
        orderId: any;
        reference: any;
        amountPaid: any;
        status: any;
        redirectUrl: any;
        userId: any;
    } | undefined>;
    verifyPaystackPaymentPreviousFlow(reference: string): Promise<{
        message: string;
        orderId: any;
        reference: any;
        amountPaid: any;
        status: any;
        redirectUrl: any;
        userId?: undefined;
    } | {
        message: string;
        orderId: any;
        reference: any;
        amountPaid: any;
        status: any;
        redirectUrl: any;
        userId: any;
    }>;
    handlePaystackWebhookStandaloneFuction(payload: any): Promise<{
        message: string;
        orderId: any;
        reference: any;
        amountPaid: any;
        status: any;
        redirectUrl: any;
        userId?: undefined;
    } | {
        message: string;
        orderId: any;
        reference: any;
        amountPaid: any;
        status: any;
        redirectUrl: any;
        userId: any;
    } | undefined>;
    verifyPaystackPaymentss(reference: string): Promise<{
        message: string;
        orderId: any;
        reference: any;
        amountPaid: any;
        status: any;
        redirectUrl: any;
        userId?: undefined;
    } | {
        message: string;
        orderId: any;
        reference: any;
        amountPaid: any;
        status: any;
        redirectUrl: any;
        userId: any;
    }>;
    verifyPaystackPaymentWithoutMailInvoice(reference: string): Promise<{
        message: string;
        orderId: any;
        reference: any;
        amountPaid: any;
        status: any;
        redirectUrl: any;
        userId?: undefined;
    } | {
        message: string;
        orderId: any;
        reference: any;
        amountPaid: any;
        status: any;
        redirectUrl: any;
        userId: any;
    }>;
    findOrderDetails(id: string): Promise<{
        order: Order;
    }>;
    findAllOrderPagination(query: Query): Promise<Order[]>;
    findAllApprovedOrderPagination(query: Query): Promise<Order[]>;
    findLoginUserAllApprovedOrderPagination(query: Query, userId: string): Promise<Order[]>;
    findAllNotApprovedOrderPagination(query: Query): Promise<Order[]>;
    findLoginUserAllNotApprovedOrderPagination(query: Query, userId: string): Promise<Order[]>;
    findAllLoginUserOrderPagination(query: Query, userId: string): Promise<Order[]>;
    findAllUserOrderPagination(query: Query, userId: string): Promise<Order[]>;
    findAll(): Promise<Order[]>;
    findOne(id: string): Promise<{
        order: Order;
    }>;
    addComment(id: string, addCommentDto: AddCommentDto, userId: string): Promise<any>;
    update(id: string, updateOrderDto: UpdateOrderDto): string;
    remove(id: number): string;
    addCommentFormData(id: string, addCommentDto: AddCommentDto, userId: string, file?: Express.Multer.File): Promise<any>;
    addCommentFormDataCLOUD(id: string, addCommentDto: AddCommentDto, userId: string, file?: Express.Multer.File): Promise<any>;
}
