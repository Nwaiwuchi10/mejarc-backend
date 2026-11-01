"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DatabaseModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmModule = exports.DatabaseModule = exports.DataSource = void 0;
exports.getRepositoryToken = getRepositoryToken;
exports.InjectRepository = InjectRepository;
exports.Like = Like;
exports.Between = Between;
exports.In = In;
exports.IsNull = IsNull;
exports.MoreThanOrEqual = MoreThanOrEqual;
exports.Entity = Entity;
exports.PrimaryGeneratedColumn = PrimaryGeneratedColumn;
exports.PrimaryColumn = PrimaryColumn;
exports.Column = Column;
exports.CreateDateColumn = CreateDateColumn;
exports.UpdateDateColumn = UpdateDateColumn;
exports.DeleteDateColumn = DeleteDateColumn;
exports.ManyToOne = ManyToOne;
exports.OneToMany = OneToMany;
exports.OneToOne = OneToOne;
exports.ManyToMany = ManyToMany;
exports.JoinColumn = JoinColumn;
exports.JoinTable = JoinTable;
exports.Index = Index;
exports.Unique = Unique;
exports.BeforeInsert = BeforeInsert;
exports.BeforeUpdate = BeforeUpdate;
exports.registerSchema = registerSchema;
exports.getSchema = getSchema;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const mongoose_repository_1 = require("./mongoose-repository");
function getRepositoryToken(entity) {
    const name = typeof entity === 'function' ? entity.name : entity;
    return `${name}Repository`;
}
function InjectRepository(entity) {
    return (0, common_1.Inject)(getRepositoryToken(entity));
}
function Like(pattern) {
    return { _type: 'like', _value: pattern };
}
function Between(from, to) {
    return { _type: 'between', _from: from, _to: to };
}
function In(values) {
    return { _type: 'in', _value: values };
}
function IsNull() {
    return { _type: 'isNull' };
}
function MoreThanOrEqual(value) {
    return { _type: 'moreThanOrEqual', _value: value };
}
class DataSource {
    async transaction(callback) {
        const mockRepo = new mongoose_repository_1.MongooseRepository({});
        return callback(mockRepo.manager);
    }
}
exports.DataSource = DataSource;
function Entity(name, options) {
    return (target) => target;
}
function PrimaryGeneratedColumn(type, options) {
    return (target, propertyKey) => { };
}
function PrimaryColumn(options) {
    return (target, propertyKey) => { };
}
function Column(typeOrOptions, options) {
    return (target, propertyKey) => { };
}
function CreateDateColumn(options) {
    return (target, propertyKey) => { };
}
function UpdateDateColumn(options) {
    return (target, propertyKey) => { };
}
function DeleteDateColumn(options) {
    return (target, propertyKey) => { };
}
function ManyToOne(typeFunctionOrTarget, inverseSideOrOptions, options) {
    return (target, propertyKey) => { };
}
function OneToMany(typeFunctionOrTarget, inverseSideOrOptions, options) {
    return (target, propertyKey) => { };
}
function OneToOne(typeFunctionOrTarget, inverseSideOrOptions, options) {
    return (target, propertyKey) => { };
}
function ManyToMany(typeFunctionOrTarget, inverseSideOrOptions, options) {
    return (target, propertyKey) => { };
}
function JoinColumn(options) {
    return (target, propertyKey) => { };
}
function JoinTable(options) {
    return (target, propertyKey) => { };
}
function Index(nameOrFields, fieldsOrOptions, options) {
    return (target, propertyKey) => { };
}
function Unique(nameOrFields, fields) {
    return (target, propertyKey) => { };
}
function BeforeInsert() {
    return (target, propertyKey) => { };
}
function BeforeUpdate() {
    return (target, propertyKey) => { };
}
const schemaRegistry = new Map();
function registerSchema(name, schema) {
    schemaRegistry.set(name, schema);
}
function getSchema(name) {
    return schemaRegistry.get(name);
}
let DatabaseModule = DatabaseModule_1 = class DatabaseModule {
    static forFeature(entities) {
        const mongooseModels = entities.map((entity) => {
            const name = typeof entity === 'function' ? entity.name : entity;
            const schema = schemaRegistry.get(name) || new mongoose_2.Schema({}, { strict: false, timestamps: true, id: false });
            return { name, schema };
        });
        const providers = entities.map((entity) => {
            const name = typeof entity === 'function' ? entity.name : entity;
            return {
                provide: getRepositoryToken(entity),
                useFactory: (model) => new mongoose_repository_1.MongooseRepository(model),
                inject: [(0, mongoose_1.getModelToken)(name)],
            };
        });
        return {
            module: DatabaseModule_1,
            imports: [mongoose_1.MongooseModule.forFeature(mongooseModels)],
            providers: [...providers, DataSource],
            exports: [...providers, DataSource, mongoose_1.MongooseModule],
        };
    }
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = DatabaseModule_1 = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({})
], DatabaseModule);
exports.TypeOrmModule = DatabaseModule;
//# sourceMappingURL=database.module.js.map