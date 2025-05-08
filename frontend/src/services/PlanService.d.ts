export interface IPlan {
    _id: string;
    name: string;
    type: string;
    description: string;
    regularAmount: number;
    discountAmount: number;
    benefits: string[];
    isListed: boolean;
    duration: string;
    createdAt: Date;
    isDeleted: boolean;
    color: string;
    isPopular: boolean;
}
export interface IUserPlan {
    planId: string;
    planName: string;
    status: string;
    startDate: Date;
    endDate?: Date;
    transactionId?: string;
    roomBenefit: number;
}
export declare class PlanService {
    getPlans(): Promise<IPlan[]>;
    getUserPlan(): Promise<IUserPlan | null>;
    reverseName(name: string): Promise<any>;
    createPayment(userId: string, planId: string, amount: number): Promise<{
        approvalUrl: string;
        paymentId: string;
    }>;
}
