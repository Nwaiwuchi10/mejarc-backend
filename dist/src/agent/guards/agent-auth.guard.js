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
var AgentAuthGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let AgentAuthGuard = AgentAuthGuard_1 = class AgentAuthGuard {
    constructor(jwtService) {
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(AgentAuthGuard_1.name);
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new common_1.UnauthorizedException('Missing agent token');
        }
        try {
            const payload = this.jwtService.verify(token);
            if (payload.role !== 'agent') {
                throw new common_1.UnauthorizedException('Access restricted to agents');
            }
            request.userId = payload.userId;
            request.agentId = payload.agentId;
            request.role = payload.role;
            return true;
        }
        catch (err) {
            this.logger.error('Agent token verification failed', err?.message);
            throw new common_1.UnauthorizedException('Invalid or expired agent token');
        }
    }
};
exports.AgentAuthGuard = AgentAuthGuard;
exports.AgentAuthGuard = AgentAuthGuard = AgentAuthGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AgentAuthGuard);
//# sourceMappingURL=agent-auth.guard.js.map