import { UserType } from '../entities/user.entity';
export declare class SignupAddressDto {
    street?: string;
    city?: string;
    zipcode?: string;
    state?: string;
    county?: string;
    country?: string;
}
export declare class CreateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    userType?: UserType;
    password: string;
    profilePics?: string;
    address?: SignupAddressDto;
}
