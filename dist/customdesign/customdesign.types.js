"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityType = exports.MilestoneStatus = exports.CustomDesignStatus = exports.SelectionMethod = exports.ServiceType = void 0;
var ServiceType;
(function (ServiceType) {
    ServiceType["LANDSCAPE_DESIGN"] = "landscape-design";
    ServiceType["INTERIOR_DESIGN"] = "interior-design";
    ServiceType["PRODUCT_DESIGN"] = "product-design";
    ServiceType["RENDERING_3D"] = "3d-rendering";
    ServiceType["ARCHITECTURAL_2D"] = "2d-architectural";
    ServiceType["BIM"] = "building-information-modeling";
    ServiceType["MEP_DRAWINGS"] = "mep-drawings";
    ServiceType["STRUCTURAL_ENGINEERING"] = "structural-engineering";
})(ServiceType || (exports.ServiceType = ServiceType = {}));
var SelectionMethod;
(function (SelectionMethod) {
    SelectionMethod["MANUAL"] = "manual";
    SelectionMethod["TEMPLATE"] = "template";
    SelectionMethod["AI_ADVICE"] = "ai-advice";
    SelectionMethod["CONTEST"] = "contest";
    SelectionMethod["HIRE_PRO"] = "hire_pro";
    SelectionMethod["FIXED_QUOTE"] = "fixed_quote";
})(SelectionMethod || (exports.SelectionMethod = SelectionMethod = {}));
var CustomDesignStatus;
(function (CustomDesignStatus) {
    CustomDesignStatus["IN_PROGRESS"] = "in_progress";
    CustomDesignStatus["SUBMITTED"] = "submitted";
    CustomDesignStatus["UNDER_REVIEW"] = "under_review";
    CustomDesignStatus["APPROVED"] = "approved";
    CustomDesignStatus["REJECTED"] = "rejected";
    CustomDesignStatus["COMPLETED"] = "completed";
    CustomDesignStatus["REVISION"] = "revision";
})(CustomDesignStatus || (exports.CustomDesignStatus = CustomDesignStatus = {}));
var MilestoneStatus;
(function (MilestoneStatus) {
    MilestoneStatus["PENDING"] = "pending";
    MilestoneStatus["IN_PROGRESS"] = "in-progress";
    MilestoneStatus["COMPLETED"] = "completed";
})(MilestoneStatus || (exports.MilestoneStatus = MilestoneStatus = {}));
var ActivityType;
(function (ActivityType) {
    ActivityType["UPLOAD"] = "upload";
    ActivityType["MESSAGE"] = "message";
    ActivityType["MILESTONE"] = "milestone";
    ActivityType["COMPLETED"] = "completed";
    ActivityType["REVISION"] = "revision";
})(ActivityType || (exports.ActivityType = ActivityType = {}));
//# sourceMappingURL=customdesign.types.js.map