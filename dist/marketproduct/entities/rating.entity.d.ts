import { User } from '../../user/entities/user.entity';
import { MarketProduct } from './marketproduct.entity';
export declare class Rating {
    id: string;
    rating: number;
    comment?: string;
    user: User;
    userId: string;
    product: MarketProduct;
    productId: string;
    createdAt: Date;
    updatedAt: Date;
}
