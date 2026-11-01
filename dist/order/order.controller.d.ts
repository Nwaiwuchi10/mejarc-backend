import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AddCommentDto } from './dto/AddOrderComment.dto';
import { ConfigService } from '@nestjs/config';
export declare class OrderController {
    private readonly orderService;
    private readonly configService;
    constructor(orderService: OrderService, configService: ConfigService);
    createOrder(createOrderDTO: CreateOrderDto, req: any): Promise<{
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
    handlePaystackWebhook(req: any, res: any): Promise<any>;
    verifyPayment(reference: string): Promise<{
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
    handlePaystackWebhooks(req: any, res: any): Promise<any>;
    getAllApprovedOrdersPagination(query: ExpressQuery): Promise<Order[]>;
    getAllNotApprovedOrdersPagination(query: ExpressQuery): Promise<Order[]>;
    getLoginUserAllApprovedOrdersPagination(query: ExpressQuery, req: any): Promise<Order[]>;
    getLoginUserAllNotApprovedOrdersPagination(query: ExpressQuery, req: any): Promise<Order[]>;
    getAllOrdersPagination(query: ExpressQuery): Promise<Order[]>;
    getAllLoginUserOrderPagination(query: ExpressQuery, req: any): Promise<Order[]>;
    findAllUserOrderPagination(query: ExpressQuery, userId: string): Promise<Order[]>;
    findAll(): Promise<Order[]>;
    findOne(id: string): Promise<{
        order: Order;
    }>;
    update(id: string, updateOrderDto: UpdateOrderDto): string;
    remove(id: string): string;
    addComment(id: string, addCommentDto: AddCommentDto, req: any): Promise<any>;
    addCommentFormData(id: string, addCommentDto: AddCommentDto, file: Express.Multer.File, req: any): Promise<any>;
}
