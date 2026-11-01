"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UverifyKycProvider = void 0;
const axios_1 = require("axios");
class UverifyKycProvider {
    constructor() {
        this.baseUrl = process.env.UVERIFY_BASE_URL ||
            'https://api.uverify.com.ng/v1/rest-api/verification';
        this.apiKey = process.env.UVERIFY_API_KEY;
        this.apiSecret = process.env.UVERIFY_API_SECRET;
    }
    async verifyDocuments(documents) {
        try {
            const payload = {
                documents: documents.map((d) => ({
                    url: d.url,
                    name: d.name,
                    key: d.key,
                })),
            };
            const url = `${this.baseUrl}/nin`;
            const headers = {
                'Content-Type': 'application/json',
            };
            if (this.apiKey)
                headers['x-api-key'] = this.apiKey;
            if (this.apiSecret)
                headers['x-api-secret'] = this.apiSecret;
            const resp = await axios_1.default.post(url, payload, { headers, timeout: 20000 });
            if (resp && resp.data) {
                const success = resp.data.status === 'success' ||
                    resp.data.success === true ||
                    resp.status === 200;
                return {
                    success,
                    providerId: resp.data.requestId || resp.data.reference || undefined,
                    notes: JSON.stringify(resp.data),
                };
            }
            return { success: false, notes: 'Empty response' };
        }
        catch (err) {
            return { success: false, notes: err?.response?.data || err.message };
        }
    }
}
exports.UverifyKycProvider = UverifyKycProvider;
//# sourceMappingURL=uverify.provider.js.map