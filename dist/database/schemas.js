"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const database_module_1 = require("./database.module");
function createEntitySchema(definition = {}) {
    const schema = new mongoose_1.Schema({
        id: { type: String, unique: true, sparse: true, index: true },
        ...definition,
    }, {
        timestamps: true,
        strict: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        id: false,
    });
    return schema;
}
const UserSchema = createEntitySchema({
    email: { type: String, unique: true, index: true },
    phoneNumber: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    password: { type: String },
    address: { type: mongoose_1.Schema.Types.Mixed },
    notificationSettings: { type: mongoose_1.Schema.Types.Mixed },
});
(0, database_module_1.registerSchema)('User', UserSchema);
const UserAddressSchema = createEntitySchema();
(0, database_module_1.registerSchema)('UserAddress', UserAddressSchema);
const UserNotificationSettingSchema = createEntitySchema();
(0, database_module_1.registerSchema)('UserNotificationSetting', UserNotificationSettingSchema);
const AdminSchema = createEntitySchema({
    userId: { type: String, index: true },
    user: { type: mongoose_1.Schema.Types.Mixed },
    isActive: { type: Boolean, default: true },
    isAdmin: { type: Boolean, default: true },
});
(0, database_module_1.registerSchema)('Admin', AdminSchema);
const AgentSchema = createEntitySchema({
    userId: { type: String, index: true },
    vendorId: { type: String, unique: true, sparse: true, index: true },
    user: { type: mongoose_1.Schema.Types.Mixed },
    profile: { type: mongoose_1.Schema.Types.Mixed },
    bioRecord: { type: mongoose_1.Schema.Types.Mixed },
    kycRecords: { type: [mongoose_1.Schema.Types.Mixed], default: [] },
    wallet: { type: mongoose_1.Schema.Types.Mixed },
    status: { type: String },
    pendingProfileChange: { type: mongoose_1.Schema.Types.Mixed },
});
(0, database_module_1.registerSchema)('Agent', AgentSchema);
const AgentProfileSchema = createEntitySchema({
    agentId: { type: String, index: true },
});
(0, database_module_1.registerSchema)('AgentProfile', AgentProfileSchema);
const AgentBioSchema = createEntitySchema({
    agentId: { type: String, index: true },
    bio: { type: String },
});
(0, database_module_1.registerSchema)('AgentBio', AgentBioSchema);
const AgentKycSchema = createEntitySchema({
    agentId: { type: String, index: true },
});
(0, database_module_1.registerSchema)('AgentKyc', AgentKycSchema);
const MarketProductSchema = createEntitySchema({
    agentId: { type: String, index: true },
    productId: { type: String, unique: true, sparse: true, index: true },
    status: { type: String, index: true },
    ratings: { type: [mongoose_1.Schema.Types.Mixed], default: [] },
});
(0, database_module_1.registerSchema)('MarketProduct', MarketProductSchema);
const RatingSchema = createEntitySchema({
    productId: { type: String, index: true },
    userId: { type: String, index: true },
});
(0, database_module_1.registerSchema)('Rating', RatingSchema);
const OrderSchema = createEntitySchema({
    userId: { type: String, index: true },
    orderItems: { type: [mongoose_1.Schema.Types.Mixed], default: [] },
});
(0, database_module_1.registerSchema)('Order', OrderSchema);
const OrderItemSchema = createEntitySchema({
    orderId: { type: String, index: true },
    productId: { type: String, index: true },
});
(0, database_module_1.registerSchema)('OrderItem', OrderItemSchema);
const ContactInquirySchema = createEntitySchema({
    email: { type: String },
    phone: { type: String },
});
(0, database_module_1.registerSchema)('ContactInquiry', ContactInquirySchema);
const ConversationSchema = createEntitySchema({
    members: { type: [mongoose_1.Schema.Types.Mixed], default: [] },
    lastMessage: { type: mongoose_1.Schema.Types.Mixed },
});
(0, database_module_1.registerSchema)('Conversation', ConversationSchema);
const ConversationMemberSchema = createEntitySchema({
    conversationId: { type: String, index: true },
    userId: { type: String, index: true },
});
(0, database_module_1.registerSchema)('ConversationMember', ConversationMemberSchema);
const MessageSchema = createEntitySchema({
    conversationId: { type: String, index: true },
    senderId: { type: String, index: true },
});
(0, database_module_1.registerSchema)('Message', MessageSchema);
const NotificationSchema = createEntitySchema({
    userId: { type: String, index: true },
    isRead: { type: Boolean, default: false },
});
(0, database_module_1.registerSchema)('Notification', NotificationSchema);
const WalletSchema = createEntitySchema({
    agentId: { type: String, index: true },
    balance: { type: Number, default: 0 },
});
(0, database_module_1.registerSchema)('Wallet', WalletSchema);
const WalletTransactionSchema = createEntitySchema({
    walletId: { type: String, index: true },
});
(0, database_module_1.registerSchema)('WalletTransaction', WalletTransactionSchema);
const WithdrawalRequestSchema = createEntitySchema({
    agentId: { type: String, index: true },
    status: { type: String, index: true },
});
(0, database_module_1.registerSchema)('WithdrawalRequest', WithdrawalRequestSchema);
const SystemSettingSchema = createEntitySchema({
    key: { type: String, unique: true, index: true },
});
(0, database_module_1.registerSchema)('SystemSetting', SystemSettingSchema);
const WithdrawalAuditLogSchema = createEntitySchema({
    agentId: { type: String, index: true },
    withdrawalId: { type: String, index: true },
});
(0, database_module_1.registerSchema)('WithdrawalAuditLog', WithdrawalAuditLogSchema);
const BankAccountSchema = createEntitySchema({
    agentId: { type: String, index: true },
    isDefault: { type: Boolean, default: false },
});
(0, database_module_1.registerSchema)('BankAccount', BankAccountSchema);
const CustomDesignSchema = createEntitySchema({
    userId: { type: String, index: true },
    agentId: { type: String, index: true },
    status: { type: String, index: true },
});
(0, database_module_1.registerSchema)('CustomDesign', CustomDesignSchema);
const CustomDesignPaymentSchema = createEntitySchema({
    customDesignId: { type: String, index: true },
    status: { type: String, index: true },
});
(0, database_module_1.registerSchema)('CustomDesignPayment', CustomDesignPaymentSchema);
const ProjectMilestoneSchema = createEntitySchema({
    customDesignId: { type: String, index: true },
});
(0, database_module_1.registerSchema)('ProjectMilestone', ProjectMilestoneSchema);
const ProjectActivitySchema = createEntitySchema({
    customDesignId: { type: String, index: true },
});
(0, database_module_1.registerSchema)('ProjectActivity', ProjectActivitySchema);
const ProjectFileSchema = createEntitySchema({
    customDesignId: { type: String, index: true },
});
(0, database_module_1.registerSchema)('ProjectFile', ProjectFileSchema);
//# sourceMappingURL=schemas.js.map