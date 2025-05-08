interface PlanFormData {
    name: string;
    type: string;
    description: string;
    regularAmount: number;
    discountAmount: number;
    benefits: string[];
    isListed: boolean;
    duration: string;
    roomBenefit: number;
}
export declare const validatePlanForm: (formData: PlanFormData) => boolean;
export {};
