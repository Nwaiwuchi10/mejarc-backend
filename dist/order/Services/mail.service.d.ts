import { User } from '../../user/entities/user.entity';
import { Repository } from 'src/database/database.module';
export declare class MailService {
    private readonly userRepository;
    private brevoClient;
    constructor(userRepository: Repository<User>);
    ConfirmOrder(email: string, firstName: string, lastName: string, amount: number, reference: string, orderItems?: any[]): Promise<void>;
    VerifyOrder(email: string, firstName: string, lastName: string, amount: number, referencePay: string, trans_status: string, orderItems?: any[]): Promise<void>;
    Invoice(email: string, firstName: string, lastName: string, amount: number, referencePay: string, trans_status: string, orderItems: any[], pricingPlan: any, orderDate: Date): Promise<void>;
    notifyAdminOfInvoice(email: string, firstName: string, lastName: string, amount: number, referencePay: string, trans_status: string, orderItems: any[], pricingPlan: any, orderDate: Date): Promise<void>;
    sendAccountCreatedMail(email: string, plainPassword?: string): Promise<void>;
    sendProductDeliveryMail(email: string, firstName: string, orderItems: any[], order?: any): Promise<void>;
    notifyAgentOfProductSale(agentEmail: string, agentName: string, productTitle: string, amountEarned: number): Promise<void>;
}
