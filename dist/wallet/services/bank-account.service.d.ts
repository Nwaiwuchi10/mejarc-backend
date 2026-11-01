import { Repository } from 'src/database/database.module';
import { BankAccount } from '../entities/bank-account.entity';
import { Agent } from '../../agent/entities/agent.entity';
import { PaystackService } from './paystack.service';
import { RegisterBankAccountDto, VerifyBankAccountDto } from '../dto/bank-account.dto';
export declare class BankAccountService {
    private readonly bankAccountRepository;
    private readonly agentRepository;
    private readonly paystackService;
    constructor(bankAccountRepository: Repository<BankAccount>, agentRepository: Repository<Agent>, paystackService: PaystackService);
    private getAgentIdByUserId;
    registerBankAccount(agentId: string, registerDto: RegisterBankAccountDto): Promise<BankAccount>;
    verifyBankAccount(agentId: string, bankAccountId: string, verifyDto: VerifyBankAccountDto): Promise<BankAccount>;
    getBankAccounts(agentId: string): Promise<BankAccount[]>;
    getDefaultBankAccount(agentId: string): Promise<BankAccount | null>;
    setDefaultBankAccount(agentId: string, bankAccountId: string): Promise<BankAccount>;
    deleteBankAccount(agentId: string, bankAccountId: string): Promise<void>;
    getRecipientCode(agentId: string): Promise<string>;
    getAccountDetailsForWithdrawal(agentId: string): Promise<{
        accountNumber: string;
        bankName: string;
        accountHolderName: string;
        resolvedName: string;
    }>;
    validateWithdrawalEligibility(agentId: string): Promise<boolean>;
    registerBankAccountByUserId(userId: string, registerDto: RegisterBankAccountDto): Promise<BankAccount>;
    verifyBankAccountByUserId(userId: string, bankAccountId: string, verifyDto: VerifyBankAccountDto): Promise<BankAccount>;
    getBankAccountsByUserId(userId: string): Promise<BankAccount[]>;
    setDefaultBankAccountByUserId(userId: string, bankAccountId: string): Promise<BankAccount>;
    deleteBankAccountByUserId(userId: string, bankAccountId: string): Promise<void>;
}
