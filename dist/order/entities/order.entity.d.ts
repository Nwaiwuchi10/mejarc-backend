import { User } from '../../user/entities/user.entity';
import { OrderItem } from './order-item.entity';
export declare enum PaymentStatus {
    paid = "paid",
    notPaid = "not paid"
}
export declare class BillingInfo {
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
}
export declare class Order {
    id: string;
    user: User;
    userId: string;
    paymentMethod: string;
    orderItems: OrderItem[];
    billingInfo: BillingInfo;
    payStackPayment: any;
    redirect_url: string;
    isPaid: boolean;
    deliveryStatus: any;
    grandTotal: number;
    projectDsc: string;
    comments: any[];
    deliveryComment: any[];
    amountPaid: string;
    date: string;
    createdAt: Date;
    updatedAt: Date;
}
