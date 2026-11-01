import { ConfigService } from '@nestjs/config';
import { Repository } from 'src/database/database.module';
import { User } from '../user/entities/user.entity';
export declare class PaystackService {
    private readonly userRepository;
    private readonly configService;
    constructor(userRepository: Repository<User>, configService: ConfigService);
    initializePayment(userId: string | null, amount: number, redirect_url: string, email: string): Promise<any>;
    initializePayments(userId: string, grandTotal: number, redirect_url: string): Promise<any>;
}
