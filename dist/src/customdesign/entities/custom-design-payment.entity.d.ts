import { CustomDesign } from '../../customdesign/entities/customdesign.entity';
import { User } from '../../user/entities/user.entity';
export declare enum CustomDesignPaymentStatus {
    PENDING_AGREEMENT = "Pending Agreement",
    AWAITING_PAYMENT = "Awaiting Payment",
    PAID = "Paid",
    FAILED = "Failed"
}
export declare class CustomDesignPayment {
    id: string;
    agreedPrice: number;
    status: CustomDesignPaymentStatus;
    paystackData: any;
    isConfirmedByAgent: boolean;
    customDesign: CustomDesign;
    customDesignId: string;
    user: User;
    userId: string;
    amountPaid: number;
    paidAt: Date;
    createdAt: Date;
    updatedAt: Date;
}
