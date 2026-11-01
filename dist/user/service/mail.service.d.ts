import { User } from '../entities/user.entity';
export declare class MailService {
    private readonly logger;
    private transporter;
    private brevoClient;
    constructor();
    staffOnboardingMail(user: User): Promise<void>;
    staffLoginMail(user: User): Promise<void>;
    sendLoginVerificationEmail(email: string, firstName: string, verificationToken: string): Promise<void>;
    sendPasswordResetEmail(email: string, token: string): Promise<void>;
    private buildTemplate;
}
