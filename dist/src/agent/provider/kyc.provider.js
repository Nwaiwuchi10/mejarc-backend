"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DummyKycProvider = void 0;
class DummyKycProvider {
    async verifyDocuments() {
        return { success: true, providerId: 'dummy-000', notes: 'auto-verified' };
    }
}
exports.DummyKycProvider = DummyKycProvider;
//# sourceMappingURL=kyc.provider.js.map