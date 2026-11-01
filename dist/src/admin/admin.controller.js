"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const admin_service_1 = require("./admin.service");
const admin_auth_guard_1 = require("./guards/admin-auth.guard");
const pagination_dto_1 = require("../utils/pagination.dto");
const admin_login_dto_1 = require("./dto/admin-login.dto");
const admin_extended_dto_1 = require("./dto/admin-extended.dto");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async makeAdmin(body) {
        return this.adminService.makeAdmin(body.userId, body.role);
    }
    async bootstrapFirstAdmin(email) {
        return this.adminService.bootstrapFirstAdmin(email);
    }
    async adminLogin(body) {
        if (!body || !body.email || !body.password) {
            throw new common_1.BadRequestException('Request body must contain email and password');
        }
        return this.adminService.adminLogin(body.email, body.password);
    }
    async verifyAdminLogin(body) {
        return this.adminService.verifyAdminLogin(body.email, body.token);
    }
    async getAllAgents(paginationDto) {
        return this.adminService.getAllAgents(paginationDto);
    }
    async getAgentApplications(query) {
        return this.adminService.getAgentApplications(query);
    }
    async getAgentDetail(agentId) {
        return this.adminService.getAgentDetail(agentId);
    }
    async approveAgent(body) {
        return this.adminService.approveAgent(body.agentId);
    }
    async rejectAgent(body) {
        return this.adminService.rejectAgent(body.agentId, body.reason);
    }
    async approveVendorProfileChange(body) {
        return this.adminService.approveVendorProfileChange(body.agentId);
    }
    async rejectVendorProfileChange(body) {
        return this.adminService.rejectVendorProfileChange(body.agentId, body.reason);
    }
    async findAll(paginationDto) {
        return this.adminService.findAll(paginationDto);
    }
    async getUsers(query) {
        return this.adminService.getAdminUsers(query);
    }
    async getUserDetail(userId) {
        return this.adminService.getAdminUserDetail(userId);
    }
    async suspendUser(userId) {
        return this.adminService.suspendUser(userId);
    }
    async activateUser(userId) {
        return this.adminService.activateUser(userId);
    }
    async getCommunicationStats() {
        return this.adminService.getCommunicationStats();
    }
    async getConversations(query) {
        return this.adminService.getConversations(query);
    }
    async getConversationDetail(conversationId) {
        return this.adminService.getConversationDetail(conversationId);
    }
    async escalateConversation(conversationId, body) {
        return this.adminService.escalateConversation(conversationId, body.reason);
    }
    async getMessages(query) {
        return this.adminService.getAdminMessages(query);
    }
    async getConversationMessages(conversationId) {
        return this.adminService.getConversationMessages(conversationId);
    }
    async sendMessage(conversationId, req, body) {
        return this.adminService.adminSendMessage(conversationId, req.adminId, body.text, body.attachments);
    }
    async getFinancialStats() {
        return this.adminService.getFinancialStats();
    }
    async getTransactions(query) {
        return this.adminService.getCustomerTransactions(query);
    }
    async getPayouts(query) {
        return this.adminService.getAgentPayouts(query);
    }
    async getDisputes(query) {
        return this.adminService.getDisputes(query);
    }
    async getRefunds(query) {
        return this.adminService.getRefunds(query);
    }
    async releasePayout(payoutId, body) {
        return this.adminService.releasePayout(payoutId, body?.notes);
    }
    async resolveDispute(disputeId, body) {
        return this.adminService.resolveDispute(disputeId, body.resolution, body.refundTo);
    }
    async approveRefund(refundId, body) {
        return this.adminService.approveRefund(refundId, body?.notes);
    }
    async getMarketplaceStats() {
        return this.adminService.getMarketplaceStats();
    }
    async getMarketplaceListings(query) {
        return this.adminService.getMarketplaceListings(query);
    }
    async getMarketplaceListing(listingId) {
        return this.adminService.getMarketplaceListing(listingId);
    }
    async approveMarketplaceListing(listingId) {
        return this.adminService.approveMarketplaceListing(listingId);
    }
    async rejectMarketplaceListing(listingId, body) {
        return this.adminService.rejectMarketplaceListing(listingId, body?.reason);
    }
    async requestMarketplaceChange(listingId, body) {
        return this.adminService.requestMarketplaceChange(listingId, body.feedback);
    }
    async getProjectStats() {
        return this.adminService.getProjectStats();
    }
    async getCustomerProjects(query) {
        return this.adminService.getCustomerProjects(query);
    }
    async getAgentPerformance(query) {
        return this.adminService.getAgentPerformance(query);
    }
    async getCustomProjects(query) {
        return this.adminService.getCustomProjectSubmissions(query);
    }
    async getProjectDetail(projectId) {
        return this.adminService.getProjectDetail(projectId);
    }
    async assignAgent(projectId, body) {
        return this.adminService.assignAgentToProject(projectId, body.agentId);
    }
    async approveCustomProject(submissionId) {
        return this.adminService.approveCustomProject(submissionId);
    }
    async rejectCustomProject(submissionId, body) {
        return this.adminService.rejectCustomProject(submissionId, body?.reason);
    }
    async getReportsSummary() {
        return this.adminService.getReportsSummary();
    }
    async getSystemHealth() {
        return this.adminService.getSystemHealth();
    }
    async getProjectPerformance() {
        return this.adminService.getProjectPerformance();
    }
    async getRevenueChart() {
        return this.adminService.getRevenueChart();
    }
    async getTopAgents() {
        return this.adminService.getTopAgents();
    }
    async getCustomerActivity() {
        return this.adminService.getCustomerActivity();
    }
    async getRolesStats() {
        return this.adminService.getRolesStats();
    }
    async getAllRoles() {
        return this.adminService.getAllRoles();
    }
    async createRole(body) {
        return this.adminService.createRole(body);
    }
    async updateRole(roleId, body) {
        return this.adminService.updateRole(roleId, body);
    }
    async deleteRole(roleId) {
        return this.adminService.deleteRole(roleId);
    }
    async getStaffList() {
        return this.adminService.getStaffList();
    }
    async assignRoleToStaff(userId, body) {
        return this.adminService.assignRoleToStaff(userId, body.roleId);
    }
    async getPermissionMatrix() {
        return this.adminService.getPermissionMatrix();
    }
    async getAdminProfile(req) {
        return this.adminService.getAdminProfile(req.adminId);
    }
    async updateAdminProfile(req, body) {
        return this.adminService.updateAdminProfile(req.adminId, body);
    }
    async changePassword(req, body) {
        return this.adminService.changeAdminPassword(req.adminId, body.currentPassword, body.newPassword);
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Post)('make-admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Promote a user to admin role' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User promoted to admin' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_login_dto_1.MakeAdminDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "makeAdmin", null);
__decorate([
    (0, common_1.Get)('believe/:email'),
    (0, swagger_1.ApiOperation)({
        summary: 'One-time endpoint to bootstrap the first superadmin by email (disables permanently after run)',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'First admin successfully promoted' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden if an admin already exists' }),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "bootstrapFirstAdmin", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({
        summary: 'Admin login step 1: Validate email/password and dispatch OTP',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'OTP sent to admin email' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid admin credentials' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_login_dto_1.AdminLoginDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "adminLogin", null);
__decorate([
    (0, common_1.Post)('verify-login'),
    (0, swagger_1.ApiOperation)({ summary: 'Admin login step 2: Verify OTP and receive JWT' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Admin authenticated with JWT token',
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid or expired OTP token' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_login_dto_1.VerifyAdminLoginDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "verifyAdminLogin", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('agents'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all agents with pagination' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of agents' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllAgents", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('agents/applications'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending agent applications for KYC review' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of agent applications' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAgentApplications", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('agents/:agentId'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get full details of a specific agent' }),
    (0, swagger_1.ApiParam)({ name: 'agentId', description: 'Agent UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agent full details' }),
    __param(0, (0, common_1.Param)('agentId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAgentDetail", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Post)('approve-agent'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve agent verification' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: { agentId: { type: 'string', example: 'uuid' } },
            required: ['agentId'],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agent approved' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "approveAgent", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Post)('reject-agent'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject agent verification' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                agentId: { type: 'string', example: 'uuid' },
                reason: { type: 'string', example: 'Document unreadable' },
            },
            required: ['agentId'],
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agent rejected' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "rejectAgent", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Post)('approve-vendor-profile-change'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve vendor name/email modification' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: { agentId: { type: 'string', example: 'uuid' } },
            required: ['agentId'],
        },
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "approveVendorProfileChange", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Post)('reject-vendor-profile-change'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject vendor name/email modification' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                agentId: { type: 'string', example: 'uuid' },
                reason: { type: 'string', example: 'Invalid credentials' },
            },
            required: ['agentId'],
        },
    }),
    openapi.ApiResponse({ status: 201 }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "rejectVendorProfileChange", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'List all admin users' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of admins' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'List all users with filtering by role and status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Filtered user list' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_extended_dto_1.AdminPaginatedQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUsers", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('users/:userId'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get single user detail' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User detail' }),
    __param(0, (0, common_1.Param)('userId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUserDetail", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Patch)('users/:userId/suspend'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Suspend user account' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User suspended' }),
    __param(0, (0, common_1.Param)('userId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "suspendUser", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Patch)('users/:userId/activate'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Activate user account' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User activated' }),
    __param(0, (0, common_1.Param)('userId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "activateUser", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('communication/stats'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get communication dashboard statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Communication stats' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getCommunicationStats", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('communication/conversations'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'List all conversations for moderation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Conversation list' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_extended_dto_1.AdminPaginatedQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getConversations", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('communication/conversations/:conversationId'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get conversation details' }),
    (0, swagger_1.ApiParam)({ name: 'conversationId', description: 'Conversation UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Conversation details' }),
    __param(0, (0, common_1.Param)('conversationId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getConversationDetail", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Post)('communication/conversations/:conversationId/escalate'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Escalate a conversation' }),
    (0, swagger_1.ApiParam)({ name: 'conversationId', description: 'Conversation UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Conversation escalated' }),
    __param(0, (0, common_1.Param)('conversationId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_extended_dto_1.AdminEscalateConversationDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "escalateConversation", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('messages'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'List messages across conversations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Messages list' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_extended_dto_1.AdminPaginatedQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getMessages", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('messages/:conversationId'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all messages inside a conversation' }),
    (0, swagger_1.ApiParam)({ name: 'conversationId', description: 'Conversation UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Messages in conversation' }),
    __param(0, (0, common_1.Param)('conversationId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getConversationMessages", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Post)('messages/:conversationId/reply'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Admin replies to a conversation' }),
    (0, swagger_1.ApiParam)({ name: 'conversationId', description: 'Conversation UUID' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Reply sent' }),
    __param(0, (0, common_1.Param)('conversationId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, admin_extended_dto_1.AdminSendMessageDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('financials/stats'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get financial summary and stats' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Financial stats' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getFinancialStats", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('financials/transactions'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all customer transactions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Transactions list' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_extended_dto_1.AdminPaginatedQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getTransactions", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('financials/payouts'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all agent payouts' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payouts list' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_extended_dto_1.AdminPaginatedQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getPayouts", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('financials/disputes'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all financial disputes' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Disputes list' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_extended_dto_1.AdminPaginatedQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDisputes", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('financials/refunds'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all refund requests' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Refunds list' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_extended_dto_1.AdminPaginatedQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getRefunds", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Patch)('financials/payouts/:payoutId/release'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Release payout to agent' }),
    (0, swagger_1.ApiParam)({ name: 'payoutId', description: 'Payout UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Payout released' }),
    __param(0, (0, common_1.Param)('payoutId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "releasePayout", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Patch)('financials/disputes/:disputeId/resolve'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Resolve dispute' }),
    (0, swagger_1.ApiParam)({ name: 'disputeId', description: 'Dispute UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Dispute resolved' }),
    __param(0, (0, common_1.Param)('disputeId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_extended_dto_1.ResolveDisputeDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "resolveDispute", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Patch)('financials/refunds/:refundId/approve'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve refund' }),
    (0, swagger_1.ApiParam)({ name: 'refundId', description: 'Refund UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Refund approved' }),
    __param(0, (0, common_1.Param)('refundId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "approveRefund", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('marketplace/stats'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get marketplace stats' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Marketplace stats' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getMarketplaceStats", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('marketplace/listings'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all marketplace listings for review' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Marketplace listings' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_extended_dto_1.AdminPaginatedQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getMarketplaceListings", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('marketplace/listings/:listingId'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get marketplace listing detail' }),
    (0, swagger_1.ApiParam)({ name: 'listingId', description: 'Listing UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Listing details' }),
    __param(0, (0, common_1.Param)('listingId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getMarketplaceListing", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Patch)('marketplace/listings/:listingId/approve'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve marketplace product listing' }),
    (0, swagger_1.ApiParam)({ name: 'listingId', description: 'Listing UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Listing approved' }),
    __param(0, (0, common_1.Param)('listingId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "approveMarketplaceListing", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Patch)('marketplace/listings/:listingId/reject'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject marketplace product listing' }),
    (0, swagger_1.ApiParam)({ name: 'listingId', description: 'Listing UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Listing rejected' }),
    __param(0, (0, common_1.Param)('listingId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_extended_dto_1.AdminMarketActionDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "rejectMarketplaceListing", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Patch)('marketplace/listings/:listingId/request-change'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Request changes on marketplace product listing' }),
    (0, swagger_1.ApiParam)({ name: 'listingId', description: 'Listing UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Change request sent' }),
    __param(0, (0, common_1.Param)('listingId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_extended_dto_1.AdminRequestChangeDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "requestMarketplaceChange", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('projects/stats'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get project oversight statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Project stats' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getProjectStats", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('projects/customers'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer projects' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Customer projects' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_extended_dto_1.AdminPaginatedQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getCustomerProjects", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('projects/agents'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get agent performance across projects' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agent project performance' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_extended_dto_1.AdminPaginatedQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAgentPerformance", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('projects/custom'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get custom design project submissions' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Custom projects list' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_extended_dto_1.AdminPaginatedQueryDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getCustomProjects", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('projects/customers/:projectId'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer project detail' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Project details' }),
    __param(0, (0, common_1.Param)('projectId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getProjectDetail", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Patch)('projects/customers/:projectId/assign-agent'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign agent to project' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Agent assigned' }),
    __param(0, (0, common_1.Param)('projectId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_extended_dto_1.AssignAgentDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "assignAgent", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Patch)('projects/custom/:submissionId/approve'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve custom design project submission' }),
    (0, swagger_1.ApiParam)({ name: 'submissionId', description: 'Submission UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Custom project approved' }),
    __param(0, (0, common_1.Param)('submissionId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "approveCustomProject", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Patch)('projects/custom/:submissionId/reject'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject custom design project submission' }),
    (0, swagger_1.ApiParam)({ name: 'submissionId', description: 'Submission UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Custom project rejected' }),
    __param(0, (0, common_1.Param)('submissionId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_extended_dto_1.AdminProjectActionDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "rejectCustomProject", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('reports/summary'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get executive dashboard report summary' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Report summary' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getReportsSummary", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('system-health'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get backend system health and metrics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'System health metrics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getSystemHealth", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('reports/performance'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get project performance metrics report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Performance report' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getProjectPerformance", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('reports/revenue-chart'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get monthly / historical revenue chart data' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Revenue chart data' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getRevenueChart", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('reports/top-agents'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get top performing agents ranking' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Top agents list' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getTopAgents", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('reports/customer-activity'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get customer platform activity report' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Customer activity data' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getCustomerActivity", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('roles/stats'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get roles and permissions statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Roles stats' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getRolesStats", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('roles'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all admin roles' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Roles list' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllRoles", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Post)('roles'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new admin role' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Role created' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_extended_dto_1.CreateRoleDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createRole", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Patch)('roles/:roleId'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an admin role' }),
    (0, swagger_1.ApiParam)({ name: 'roleId', description: 'Role UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Role updated' }),
    __param(0, (0, common_1.Param)('roleId', new common_1.ParseUUIDPipe())),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_extended_dto_1.UpdateRoleDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateRole", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Delete)('roles/:roleId'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an admin role' }),
    (0, swagger_1.ApiParam)({ name: 'roleId', description: 'Role UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Role deleted' }),
    __param(0, (0, common_1.Param)('roleId', new common_1.ParseUUIDPipe())),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "deleteRole", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('roles/staff'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get staff members and their assigned roles' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff list' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStaffList", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Patch)('roles/staff/:userId/assign'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign a role to staff user' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Role assigned' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, admin_extended_dto_1.AssignRoleDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "assignRoleToStaff", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('roles/permissions'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get RBAC permissions matrix' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Permissions matrix' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getPermissionMatrix", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Get)('settings/profile'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Get current admin profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Admin profile' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAdminProfile", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Patch)('settings/profile'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Update current admin profile' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Admin profile updated' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, admin_extended_dto_1.UpdateAdminProfileDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateAdminProfile", null);
__decorate([
    (0, common_1.UseGuards)(admin_auth_guard_1.AdminAuthGuard),
    (0, common_1.Patch)('settings/security/change-password'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Change admin password' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Password changed successfully' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, admin_extended_dto_1.ChangeAdminPasswordDto]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "changePassword", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map