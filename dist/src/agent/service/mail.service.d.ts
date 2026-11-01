import { User } from '../../user/entities/user.entity';
import { Agent } from '../entities/agent.entity';
export declare class AgentMailService {
    private transporter;
    private readonly logger;
    private brevoClient;
    constructor();
    sendKycUploadedNotification(adminUser: User, agent: Agent): Promise<void>;
    sendAgentApprovalNotification(agentUser: User, agent: Agent, approved: boolean): Promise<void>;
    sendAgentRejectionNotification(agentUser: User, agent: Agent, reason: string): Promise<void>;
    sendAgentRegistrationSubmittedNotification(agentUser: User, agent: Agent): Promise<void>;
    private buildTemplate;
}
