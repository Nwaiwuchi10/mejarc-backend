import { S3Client } from '@aws-sdk/client-s3';
export declare const s3Client: S3Client | null;
export declare const AWS_S3_BUCKET_NAME: string;
export declare function createS3Storage(keyPrefix: string): any;
