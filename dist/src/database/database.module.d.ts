import { DynamicModule } from '@nestjs/common';
import { Schema } from 'mongoose';
import { MongooseRepository } from './mongoose-repository';
export declare function getRepositoryToken(entity: any): string;
export declare function InjectRepository(entity: any): PropertyDecorator & ParameterDecorator;
export type Repository<T = any> = MongooseRepository<T>;
export declare function Like(pattern: string): {
    _type: string;
    _value: string;
};
export declare function Between(from: any, to: any): {
    _type: string;
    _from: any;
    _to: any;
};
export declare function In(values: any[]): {
    _type: string;
    _value: any[];
};
export declare function IsNull(): {
    _type: string;
};
export declare function MoreThanOrEqual(value: any): {
    _type: string;
    _value: any;
};
export declare class DataSource {
    transaction<T>(callback: (manager: any) => Promise<T>): Promise<T>;
}
export declare function Entity(name?: string, options?: any): ClassDecorator;
export declare function PrimaryGeneratedColumn(type?: any, options?: any): PropertyDecorator;
export declare function PrimaryColumn(options?: any): PropertyDecorator;
export declare function Column(typeOrOptions?: any, options?: any): PropertyDecorator;
export declare function CreateDateColumn(options?: any): PropertyDecorator;
export declare function UpdateDateColumn(options?: any): PropertyDecorator;
export declare function DeleteDateColumn(options?: any): PropertyDecorator;
export declare function ManyToOne(typeFunctionOrTarget?: any, inverseSideOrOptions?: any, options?: any): PropertyDecorator;
export declare function OneToMany(typeFunctionOrTarget?: any, inverseSideOrOptions?: any, options?: any): PropertyDecorator;
export declare function OneToOne(typeFunctionOrTarget?: any, inverseSideOrOptions?: any, options?: any): PropertyDecorator;
export declare function ManyToMany(typeFunctionOrTarget?: any, inverseSideOrOptions?: any, options?: any): PropertyDecorator;
export declare function JoinColumn(options?: any): PropertyDecorator;
export declare function JoinTable(options?: any): PropertyDecorator;
export declare function Index(nameOrFields?: any, fieldsOrOptions?: any, options?: any): any;
export declare function Unique(nameOrFields?: any, fields?: any): any;
export declare function BeforeInsert(): PropertyDecorator;
export declare function BeforeUpdate(): PropertyDecorator;
export declare function registerSchema(name: string, schema: Schema): void;
export declare function getSchema(name: string): Schema | undefined;
export declare class DatabaseModule {
    static forFeature(entities: any[]): DynamicModule;
}
export declare const TypeOrmModule: typeof DatabaseModule;
