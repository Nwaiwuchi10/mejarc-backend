import { Repository } from 'src/database/database.module';
import { ContactInquiry } from './entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
export declare class ContactService {
    private readonly contactRepo;
    private readonly logger;
    private brevoClient;
    constructor(contactRepo: Repository<ContactInquiry>);
    create(dto: CreateContactDto): Promise<any>;
    findAll(): Promise<ContactInquiry[]>;
}
