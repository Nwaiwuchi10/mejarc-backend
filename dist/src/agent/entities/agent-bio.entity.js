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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentBio = void 0;
const openapi = require("@nestjs/swagger");
const database_module_1 = require("../../database/database.module");
const agent_entity_1 = require("./agent.entity");
let AgentBio = class AgentBio {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, agent: { required: true, type: () => require("./agent.entity").Agent }, agentId: { required: true, type: () => String }, bio: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.AgentBio = AgentBio;
__decorate([
    (0, database_module_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AgentBio.prototype, "id", void 0);
__decorate([
    (0, database_module_1.OneToOne)(() => agent_entity_1.Agent, (agent) => agent.bioRecord, {
        nullable: false,
        onDelete: 'CASCADE',
    }),
    (0, database_module_1.JoinColumn)({ name: 'agentId' }),
    __metadata("design:type", agent_entity_1.Agent)
], AgentBio.prototype, "agent", void 0);
__decorate([
    (0, database_module_1.Column)('uuid'),
    __metadata("design:type", String)
], AgentBio.prototype, "agentId", void 0);
__decorate([
    (0, database_module_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], AgentBio.prototype, "bio", void 0);
__decorate([
    (0, database_module_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AgentBio.prototype, "createdAt", void 0);
__decorate([
    (0, database_module_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AgentBio.prototype, "updatedAt", void 0);
exports.AgentBio = AgentBio = __decorate([
    (0, database_module_1.Entity)('agent_bios')
], AgentBio);
//# sourceMappingURL=agent-bio.entity.js.map