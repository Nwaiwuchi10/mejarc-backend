import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginRequestDto, VerifyLoginTokenDto } from './dto/login.dto';
import { PaginationDto } from '../utils/pagination.dto';
import { UpdateNotificationSettingsDto } from './dto/notification-settings.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(file: Express.Multer.File, dto: string): Promise<any>;
    creates(createUserDto: CreateUserDto): Promise<any>;
    login(loginDto: LoginRequestDto): Promise<{
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
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    resetPassword(token: string, newPassword: string): Promise<{
        message: string;
    }>;
    findAll(paginationDto: PaginationDto): Promise<{
        data: import("./entities/user.entity").User[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<import("./entities/user.entity").User>;
    remove(id: string): Promise<{
        message: string;
    }>;
    updateProfile(req: any, file: Express.Multer.File, dto: string): Promise<any>;
    getNotificationSettings(req: any): Promise<import("./entities/user-notification-setting.entity").UserNotificationSetting | null>;
    updateNotificationSettings(req: any, dto: UpdateNotificationSettingsDto): Promise<any>;
}
