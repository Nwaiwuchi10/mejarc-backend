import { User } from '../../user/entities/user.entity';
export declare class MarketProductMailService {
    private transporter;
    private readonly logger;
    private brevoClient;
    constructor();
    sendProductSubmittedNotification(agentUser: User, product: any): Promise<void>;
    private buildTemplate;
}
