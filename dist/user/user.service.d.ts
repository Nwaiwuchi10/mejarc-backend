import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginRequestDto, VerifyLoginTokenDto } from './dto/login.dto';
import { User } from './entities/user.entity';
import { DataSource, Repository } from 'src/database/database.module';
import { UserAddress } from './entities/user-adress.entity';
import { MailService } from './service/mail.service';
import { Agent } from '../agent/entities/agent.entity';
import { PaginationDto } from '../utils/pagination.dto';
import { UserNotificationSetting } from './entities/user-notification-setting.entity';
import { UpdateNotificationSettingsDto } from './dto/notification-settings.dto';
export declare class UserService {
    private readonly dataSource;
    private readonly userRepo;
    private readonly addressRepo;
    private readonly agentRepo;
    private readonly settingsRepo;
    private readonly mailService;
    private readonly jwtService;
    constructor(dataSource: DataSource, userRepo: Repository<User>, addressRepo: Repository<UserAddress>, agentRepo: Repository<Agent>, settingsRepo: Repository<UserNotificationSetting>, mailService: MailService, jwtService: JwtService);
    create(dto: CreateUserDto, file?: Express.Multer.File): Promise<any>;
    initiateLogin(loginDto: LoginRequestDto): Promise<{
        success: boolean;
        message: string;
        email: string;
        expiresIn: string;
    }>;
    verifyLoginToken(verifyDto: VerifyLoginTokenDto): Promise<{
        agentToken?: string | undefined;
        success: boolean;
        message: string;
        isAgent: boolean;
        isAgentApproved: boolean;
        userId: any;
        agentId: string | undefined;
        role: string;
        user: any;
        userToken: string;
    }>;
    generateJWT(user: User): Promise<string>;
    private generateJwt;
    remove(id: string): Promise<{
        message: string;
    }>;
    update(id: string, dto: UpdateUserDto, file?: Express.Multer.File): Promise<any>;
    findAll(paginationDto: PaginationDto): Promise<{
        data: User[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<User>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
    getNotificationSettings(userId: string): Promise<UserNotificationSetting | null>;
    updateNotificationSettings(userId: string, dto: UpdateNotificationSettingsDto): Promise<any>;
}
