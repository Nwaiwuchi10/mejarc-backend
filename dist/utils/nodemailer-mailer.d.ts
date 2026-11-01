import * as nodemailer from 'nodemailer';
export interface SendMailOptions {
    sender?: {
        name?: string;
        email?: string;
    };
    to: Array<{
        email: string;
        name?: string;
    }> | string;
    subject: string;
    htmlContent?: string;
    textContent?: string;
    attachment?: Array<{
        content?: string;
        name?: string;
        url?: string;
        path?: string;
    }>;
    [key: string]: any;
}
export declare class NodemailerMailer {
    private static transporter;
    static getTransporter(): nodemailer.Transporter;
    static sendTransacEmail(options: SendMailOptions): Promise<any>;
}
