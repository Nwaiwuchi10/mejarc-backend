"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodemailerMailer = void 0;
const nodemailer = require("nodemailer");
class NodemailerMailer {
    static getTransporter() {
        if (!this.transporter) {
            const user = process.env.GMAIL_USER || 'carneizltd@gmail.com';
            const pass = (process.env.GMAIL_PASS || 'ljdc ducb dwkq stdo').replace(/\s+/g, '');
            this.transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user,
                    pass,
                },
            });
        }
        return this.transporter;
    }
    static async sendTransacEmail(options) {
        const transporter = this.getTransporter();
        const defaultUser = process.env.GMAIL_USER || 'carneizltd@gmail.com';
        let recipients = [];
        if (typeof options.to === 'string') {
            recipients = [options.to];
        }
        else if (Array.isArray(options.to)) {
            recipients = options.to.map((t) => (typeof t === 'string' ? t : t.email));
        }
        const attachments = (options.attachment || []).map((att) => {
            if (att.content) {
                return {
                    filename: att.name || 'attachment',
                    content: Buffer.from(att.content, 'base64'),
                };
            }
            if (att.url) {
                return {
                    filename: att.name || 'attachment',
                    path: att.url,
                };
            }
            return att;
        });
        const mailOptions = {
            from: `"${options.sender?.name || 'Mejarc'}" <${options.sender?.email || defaultUser}>`,
            to: recipients.join(', '),
            subject: options.subject,
            html: options.htmlContent,
            text: options.textContent,
            attachments,
        };
        return transporter.sendMail(mailOptions);
    }
}
exports.NodemailerMailer = NodemailerMailer;
NodemailerMailer.transporter = null;
//# sourceMappingURL=nodemailer-mailer.js.map