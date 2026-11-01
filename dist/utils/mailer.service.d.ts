import * as nodemailer from 'nodemailer';
export declare class NodemailerTransportService {
    private readonly logger;
    private transporter;
    constructor();
    sendMail(options: {
        to: string | string[];
        subject: string;
        html?: string;
        text?: string;
        attachments?: any[];
    }): Promise<any>;
    getTransporter(): nodemailer.Transporter;
}
export declare const mailerService: NodemailerTransportService;
