import { Order } from './order.entity';
import { MarketProduct } from '../../marketproduct/entities/marketproduct.entity';
export declare class OrderItem {
    id: string;
    order: Order;
    orderId: string;
    product: MarketProduct;
    productId: string;
    totalQuantity: number;
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
}
