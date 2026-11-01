declare class OrderItemDTO {
    productId: string;
    totalQuantity: number;
    totalPrice: number;
}
declare class BillingInfoDTO {
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
export declare class CreateOrderDto {
    redirect_url: string;
    projectDsc: string;
    orderItems: OrderItemDTO[];
    amountPaid?: number;
    email?: string;
    billingInfo: BillingInfoDTO;
}
export {};
