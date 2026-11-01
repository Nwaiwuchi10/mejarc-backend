import { Model } from 'mongoose';
export type FindOptionsWhere<T> = {
    [P in keyof T]?: any;
};
export interface FindOneOptions<T = any> {
    where?: any;
    relations?: string[];
    select?: any;
    order?: any;
}
export interface FindManyOptions<T = any> extends FindOneOptions<T> {
    skip?: number;
    take?: number;
}
export declare class QueryBuilder<T> {
    private model;
    private alias;
    private query;
    private sortObj;
    private skipVal?;
    private limitVal?;
    private populateList;
    private isDeleteOp;
    private updateSet;
    constructor(model: Model<T>, alias: string);
    where(condition: any, params?: Record<string, any>): this;
    andWhere(condition: any, params?: Record<string, any>): this;
    orWhere(condition: any, params?: Record<string, any>): this;
    leftJoinAndSelect(property: string, alias: string): this;
    innerJoinAndSelect(property: string, alias: string): this;
    leftJoin(property: string, alias: string): this;
    innerJoin(property: string, alias: string): this;
    leftJoinAndMapOne(mapToProperty: string, target: any, alias: string, condition?: string): this;
    delete(): this;
    update(targetEntity?: any): this;
    set(values: any): this;
    from(target: any, alias?: string): this;
    select(selection?: any): this;
    addSelect(selection: any): this;
    orderBy(sort: string, order?: 'ASC' | 'DESC' | 1 | -1): this;
    addOrderBy(sort: string, order?: 'ASC' | 'DESC' | 1 | -1): this;
    skip(val: number): this;
    take(val: number): this;
    execute(): Promise<any>;
    getOne(): Promise<any>;
    getMany(): Promise<any[]>;
    getManyAndCount(): Promise<[any[], number]>;
    getCount(): Promise<number>;
}
export declare class MongooseRepository<T = any> {
    readonly model: Model<T>;
    private static repoRegistry;
    static registerRepo(name: string, repo: MongooseRepository<any>): void;
    static getRepoByName(name: string): MongooseRepository<any> | undefined;
    constructor(model: Model<T>);
    get manager(): any;
    createQueryBuilder(alias?: string): QueryBuilder<T>;
    private transformWhere;
    private transformRelations;
    private transformOrder;
    create(dtoOrTarget: any, dtoObj?: any): any;
    save(entityOrEntities: any): Promise<any>;
    find(options?: FindManyOptions<T>): Promise<T[]>;
    findOne(options: FindOneOptions<T>): Promise<T | null>;
    findBy(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<T[]>;
    findOneBy(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<T | null>;
    findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]>;
    count(options?: FindOneOptions<T>): Promise<number>;
    update(criteria: any, partialEntity: any): Promise<any>;
    delete(criteria: any): Promise<any>;
    remove(entityOrEntities: any): Promise<any>;
    softDelete(criteria: any): Promise<any>;
    softRemove(entityOrEntities: any): Promise<any>;
    query(queryString: string, params?: any[]): Promise<any>;
}
