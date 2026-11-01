"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProOverviewDto = void 0;
const openapi = require("@nestjs/swagger");
class ProOverviewDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, businessName: { required: true, type: () => String }, profilePicture: { required: true, type: () => String }, professionalTitle: { required: true, type: () => String }, specializations: { required: true, type: () => [String] }, rating: { required: true, type: () => Number }, yearsOfExperience: { required: true, type: () => Number }, completedProjects: { required: true, type: () => Number }, location: { required: true, type: () => String }, priceRange: { required: true, type: () => String }, responseTime: { required: true, type: () => String } };
    }
}
exports.ProOverviewDto = ProOverviewDto;
//# sourceMappingURL=pro-overview.dto.js.map