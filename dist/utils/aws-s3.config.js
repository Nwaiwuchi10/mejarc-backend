"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AWS_S3_BUCKET_NAME = exports.s3Client = exports.getMulterS3 = void 0;
exports.createS3Storage = createS3Storage;
const client_s3_1 = require("@aws-sdk/client-s3");
const multerS3Pkg = require('multer-s3');
const multerS3Storage = typeof multerS3Pkg === 'function' ? multerS3Pkg : (multerS3Pkg && multerS3Pkg.default ? multerS3Pkg.default : multerS3Pkg);
const getMulterS3 = () => multerS3Storage;
exports.getMulterS3 = getMulterS3;
const multer_1 = require("multer");
const dotenv = require("dotenv");
dotenv.config();
const hasS3Credentials = !!(process.env.AWS_REGION &&
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_S3_BUCKET_NAME);
exports.s3Client = hasS3Credentials
    ? new client_s3_1.S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    })
    : null;
exports.AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || '';
if (exports.s3Client && exports.AWS_S3_BUCKET_NAME) {
    exports.s3Client
        .send(new client_s3_1.HeadBucketCommand({ Bucket: exports.AWS_S3_BUCKET_NAME }))
        .catch((err) => {
        console.log('S3 clock synchronization check finished (error expected/ignored):', err.name || err.message);
    });
}
console.log('AWS S3 Configuration:', {
    hasS3Credentials,
    REGION: process.env.AWS_REGION,
    BUCKET: process.env.AWS_S3_BUCKET_NAME,
});
function createS3Storage(keyPrefix) {
    if (!hasS3Credentials || !exports.s3Client) {
        console.warn('S3 credentials not available. Using in-memory storage (data will be lost on restart)');
        return (0, multer_1.memoryStorage)();
    }
    return multerS3Storage({
        s3: exports.s3Client,
        bucket: exports.AWS_S3_BUCKET_NAME,
        contentType: multerS3Storage.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const sanitized = file.originalname
                .replace(/\s+/g, '')
                .replace(/[^a-zA-Z0-9.-]/g, '');
            cb(null, `${keyPrefix}/${Date.now()}-${sanitized}`);
        },
    });
}
//# sourceMappingURL=aws-s3.config.js.map