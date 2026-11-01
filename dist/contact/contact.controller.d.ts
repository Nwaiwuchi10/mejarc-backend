import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
export declare class ContactController {
    private readonly contactService;
    constructor(contactService: ContactService);
    create(createContactDto: CreateContactDto, files?: Express.Multer.File[]): Promise<any>;
    findAll(): Promise<import("./entities/contact.entity").ContactInquiry[]>;
}
