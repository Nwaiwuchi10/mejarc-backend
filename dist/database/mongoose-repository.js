"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongooseRepository = exports.QueryBuilder = void 0;
const uuid_1 = require("uuid");
class QueryBuilder {
    constructor(model, alias) {
        this.model = model;
        this.alias = alias;
        this.query = {};
        this.sortObj = {};
        this.populateList = [];
        this.isDeleteOp = false;
        this.updateSet = null;
    }
    where(condition, params) {
        if (params) {
            Object.entries(params).forEach(([key, val]) => {
                this.query[key] = val;
            });
        }
        else if (typeof condition === 'object' && condition !== null) {
            Object.assign(this.query, condition);
        }
        return this;
    }
    andWhere(condition, params) {
        return this.where(condition, params);
    }
    orWhere(condition, params) {
        return this.where(condition, params);
    }
    leftJoinAndSelect(property, alias) {
        const field = property.includes('.') ? property.split('.').pop() : property;
        if (!this.populateList.includes(field)) {
            this.populateList.push(field);
        }
        return this;
    }
    innerJoinAndSelect(property, alias) {
        return this.leftJoinAndSelect(property, alias);
    }
    leftJoin(property, alias) {
        return this.leftJoinAndSelect(property, alias);
    }
    innerJoin(property, alias) {
        return this.leftJoinAndSelect(property, alias);
    }
    leftJoinAndMapOne(mapToProperty, target, alias, condition) {
        const field = mapToProperty.includes('.') ? mapToProperty.split('.').pop() : mapToProperty;
        if (!this.populateList.includes(field)) {
            this.populateList.push(field);
        }
        return this;
    }
    delete() {
        this.isDeleteOp = true;
        return this;
    }
    update(targetEntity) {
        return this;
    }
    set(values) {
        this.updateSet = values;
        return this;
    }
    from(target, alias) {
        return this;
    }
    select(selection) {
        return this;
    }
    addSelect(selection) {
        return this;
    }
    orderBy(sort, order = 'ASC') {
        const field = sort.includes('.') ? sort.split('.').pop() : sort;
        this.sortObj[field] = order === 'DESC' || order === -1 ? -1 : 1;
        return this;
    }
    addOrderBy(sort, order = 'ASC') {
        return this.orderBy(sort, order);
    }
    skip(val) {
        this.skipVal = val;
        return this;
    }
    take(val) {
        this.limitVal = val;
        return this;
    }
    async execute() {
        if (this.isDeleteOp) {
            return this.model.deleteMany(this.query).exec();
        }
        if (this.updateSet) {
            return this.model.updateMany(this.query, { $set: this.updateSet }).exec();
        }
        return null;
    }
    async getOne() {
        let q = this.model.findOne(this.query);
        for (const pop of this.populateList) {
            q = q.populate(pop);
        }
        if (Object.keys(this.sortObj).length > 0) {
            q = q.sort(this.sortObj);
        }
        const doc = await q.exec();
        return doc ? doc.toObject ? doc.toObject({ virtuals: true }) : doc : null;
    }
    async getMany() {
        let q = this.model.find(this.query);
        for (const pop of this.populateList) {
            q = q.populate(pop);
        }
        if (Object.keys(this.sortObj).length > 0) {
            q = q.sort(this.sortObj);
        }
        if (this.skipVal !== undefined) {
            q = q.skip(this.skipVal);
        }
        if (this.limitVal !== undefined) {
            q = q.limit(this.limitVal);
        }
        const docs = await q.exec();
        return docs.map((d) => (d.toObject ? d.toObject({ virtuals: true }) : d));
    }
    async getManyAndCount() {
        const total = await this.model.countDocuments(this.query).exec();
        const items = await this.getMany();
        return [items, total];
    }
    async getCount() {
        return this.model.countDocuments(this.query).exec();
    }
}
exports.QueryBuilder = QueryBuilder;
class MongooseRepository {
    static registerRepo(name, repo) {
        this.repoRegistry.set(name, repo);
    }
    static getRepoByName(name) {
        return this.repoRegistry.get(name);
    }
    constructor(model) {
        this.model = model;
        if (model && model.modelName) {
            MongooseRepository.registerRepo(model.modelName, this);
        }
    }
    get manager() {
        return {
            connection: {
                createQueryRunner: () => ({
                    connect: async () => { },
                    startTransaction: async () => { },
                    commitTransaction: async () => { },
                    rollbackTransaction: async () => { },
                    release: async () => { },
                    manager: this.manager,
                }),
            },
            save: async (entityOrTarget, entityObj) => {
                if (entityObj !== undefined) {
                    const targetName = typeof entityOrTarget === 'function' ? entityOrTarget.name : entityOrTarget;
                    const repo = MongooseRepository.getRepoByName(targetName) || this;
                    return repo.save(entityObj);
                }
                return this.save(entityOrTarget);
            },
            findOne: async (target, options) => {
                if (options !== undefined) {
                    const targetName = typeof target === 'function' ? target.name : target;
                    const repo = MongooseRepository.getRepoByName(targetName) || this;
                    return repo.findOne(options);
                }
                return this.findOne(target);
            },
            create: (target, dto) => {
                if (dto !== undefined) {
                    const targetName = typeof target === 'function' ? target.name : target;
                    const repo = MongooseRepository.getRepoByName(targetName) || this;
                    return repo.create(target, dto);
                }
                return this.create(target);
            },
            getRepository: (target) => {
                const targetName = typeof target === 'function' ? target.name : target;
                return MongooseRepository.getRepoByName(targetName) || this;
            },
        };
    }
    createQueryBuilder(alias = '') {
        return new QueryBuilder(this.model, alias);
    }
    transformWhere(where) {
        if (!where)
            return {};
        if (Array.isArray(where)) {
            return { $or: where.map((w) => this.transformWhere(w)) };
        }
        const mongoQuery = {};
        for (const [key, val] of Object.entries(where)) {
            if (val === undefined)
                continue;
            if (val === null) {
                mongoQuery[key] = null;
            }
            else if (typeof val === 'object' && val !== null) {
                if ('_type' in val) {
                    const typeormSpecial = val;
                    if (typeormSpecial._type === 'like') {
                        const regexStr = typeormSpecial._value.replace(/%/g, '.*');
                        mongoQuery[key] = { $regex: new RegExp(regexStr, 'i') };
                    }
                    else if (typeormSpecial._type === 'between') {
                        mongoQuery[key] = {
                            $gte: typeormSpecial._from,
                            $lte: typeormSpecial._to,
                        };
                    }
                    else if (typeormSpecial._type === 'in') {
                        mongoQuery[key] = { $in: typeormSpecial._value };
                    }
                    else if (typeormSpecial._type === 'isNull') {
                        mongoQuery[key] = null;
                    }
                    else if (typeormSpecial._type === 'moreThanOrEqual') {
                        mongoQuery[key] = { $gte: typeormSpecial._value };
                    }
                    else {
                        mongoQuery[key] = val;
                    }
                }
                else if (val instanceof RegExp) {
                    mongoQuery[key] = val;
                }
                else {
                    mongoQuery[key] = val;
                }
            }
            else {
                mongoQuery[key] = val;
            }
        }
        return mongoQuery;
    }
    transformRelations(relations) {
        if (!relations)
            return [];
        return relations.map((rel) => rel.trim());
    }
    transformOrder(order) {
        if (!order)
            return {};
        const sort = {};
        for (const [key, val] of Object.entries(order)) {
            sort[key] = val === 'DESC' || val === -1 ? -1 : 1;
        }
        return sort;
    }
    create(dtoOrTarget, dtoObj) {
        let dto = dtoOrTarget;
        let targetClass = null;
        if (dtoObj !== undefined) {
            targetClass = dtoOrTarget;
            dto = dtoObj;
        }
        if (Array.isArray(dto)) {
            return dto.map((d) => this.create(d));
        }
        const payload = { ...dto };
        if (!payload.id) {
            payload.id = (0, uuid_1.v4)();
        }
        let instance;
        if (typeof targetClass === 'function') {
            instance = new targetClass();
            Object.assign(instance, payload);
        }
        else {
            instance = Object.assign({}, payload);
        }
        return instance;
    }
    async save(entityOrEntities) {
        if (Array.isArray(entityOrEntities)) {
            return Promise.all(entityOrEntities.map((e) => this.save(e)));
        }
        const item = entityOrEntities;
        if (!item)
            return item;
        if (this.model && this.model.modelName === 'MarketProduct' && !item.productId) {
            let prefix = 'BLP';
            const cat = item.category;
            if (cat === 'Product Design' || cat === 'Interior Design') {
                prefix = 'PRD';
            }
            else if (cat === 'Building Guide' || cat === 'Landscape Design') {
                prefix = 'BLG';
            }
            const count = await this.model.countDocuments().exec();
            item.productId = `${prefix}${String(count + 1).padStart(3, '0')}`;
        }
        if (this.model && this.model.modelName === 'Agent' && !item.vendorId) {
            const count = await this.model.countDocuments().exec();
            item.vendorId = `VN${String(count + 1).padStart(4, '0')}`;
        }
        if (typeof item.hashPassword === 'function') {
            await item.hashPassword();
        }
        if (typeof item.save === 'function') {
            const saved = await item.save();
            return saved.toObject ? saved.toObject({ virtuals: true }) : saved;
        }
        const id = item.id || (item._id ? item._id.toString() : (0, uuid_1.v4)());
        item.id = id;
        const upserted = await this.model.findOneAndUpdate({ id }, { $set: item }, { new: true, upsert: true, setDefaultsOnInsert: true }).exec();
        return upserted ? (upserted.toObject ? upserted.toObject({ virtuals: true }) : upserted) : item;
    }
    async find(options) {
        const filter = this.transformWhere(options?.where);
        let q = this.model.find(filter);
        const rels = this.transformRelations(options?.relations);
        for (const rel of rels) {
            q = q.populate(rel);
        }
        if (options?.order) {
            q = q.sort(this.transformOrder(options.order));
        }
        if (options?.skip !== undefined) {
            q = q.skip(options.skip);
        }
        if (options?.take !== undefined) {
            q = q.limit(options.take);
        }
        const docs = await q.exec();
        return docs.map((d) => (d.toObject ? d.toObject({ virtuals: true }) : d));
    }
    async findOne(options) {
        const filter = this.transformWhere(options.where);
        let q = this.model.findOne(filter);
        const rels = this.transformRelations(options.relations);
        for (const rel of rels) {
            q = q.populate(rel);
        }
        if (options.order) {
            q = q.sort(this.transformOrder(options.order));
        }
        const doc = await q.exec();
        return doc ? (doc.toObject ? doc.toObject({ virtuals: true }) : doc) : null;
    }
    async findBy(where) {
        return this.find({ where });
    }
    async findOneBy(where) {
        return this.findOne({ where });
    }
    async findAndCount(options) {
        const filter = this.transformWhere(options?.where);
        const count = await this.model.countDocuments(filter).exec();
        const rows = await this.find(options);
        return [rows, count];
    }
    async count(options) {
        const filter = this.transformWhere(options?.where);
        return this.model.countDocuments(filter).exec();
    }
    async update(criteria, partialEntity) {
        let filter = typeof criteria === 'string' || typeof criteria === 'number'
            ? { id: criteria }
            : this.transformWhere(criteria);
        const res = await this.model.updateMany(filter, { $set: partialEntity }).exec();
        return {
            raw: res,
            affected: res.modifiedCount,
            generatedMaps: [],
        };
    }
    async delete(criteria) {
        let filter = typeof criteria === 'string' || typeof criteria === 'number'
            ? { id: criteria }
            : this.transformWhere(criteria);
        const res = await this.model.deleteMany(filter).exec();
        return {
            raw: res,
            affected: res.deletedCount,
        };
    }
    async remove(entityOrEntities) {
        if (Array.isArray(entityOrEntities)) {
            return Promise.all(entityOrEntities.map((e) => this.remove(e)));
        }
        const id = entityOrEntities?.id;
        if (id) {
            await this.model.deleteOne({ id }).exec();
        }
        return entityOrEntities;
    }
    async softDelete(criteria) {
        return this.update(criteria, { deletedAt: new Date() });
    }
    async softRemove(entityOrEntities) {
        if (Array.isArray(entityOrEntities)) {
            return Promise.all(entityOrEntities.map((e) => this.softRemove(e)));
        }
        if (entityOrEntities?.id) {
            await this.softDelete(entityOrEntities.id);
        }
        return entityOrEntities;
    }
    async query(queryString, params) {
        return [{ '?column?': 1 }];
    }
}
exports.MongooseRepository = MongooseRepository;
MongooseRepository.repoRegistry = new Map();
//# sourceMappingURL=mongoose-repository.js.map