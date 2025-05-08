import axiosInstance from "@/utils/axiosInterceptor";
import { AxiosError } from "axios";
export class PlanService {
    async getPlans() {
        try {
            const response = await axiosInstance.get('/plans');
            console.log('plans from plans serrvice response ', response);
            const plans = response.data.data
                .filter((plan) => plan.isListed && !plan.isDeleted)
                .map((plan, index, array) => ({
                ...plan,
                id: plan._id,
                color: plan.isPopular ? "bg-purple-600/50" : "from-purple-600 to-purple-900",
                isPopular: index === array.length - 1, // Mark the last plan (highest regularAmount) as popular
            }));
            plans.sort((a, b) => a.regularAmount - b.regularAmount);
            return plans;
        }
        catch (error) {
            if (error instanceof AxiosError && error.message) {
                throw new Error(error.response?.data.message);
            }
            throw new Error("Failed to fetch plans");
        }
    }
    async getUserPlan() {
        try {
            const response = await axiosInstance.get('/user-plan');
            console.log('user plan from plan service response ', response);
            return response.data.data || null;
        }
        catch (error) {
            if (error instanceof AxiosError && error.message) {
                throw new Error(error.response?.data.message);
            }
            throw new Error("Failed to fetch user plan");
        }
    }
    async reverseName(name) {
        const response = await axiosInstance.post(`/reverse/${name}`);
        return response.data;
    }
    async createPayment(userId, planId, amount) {
        try {
            const response = await axiosInstance.post('/payments/create', { userId, planId, amount });
            return response.data.data;
        }
        catch (error) {
            if (error instanceof AxiosError && error.message) {
                throw new Error(error.response?.data.message);
            }
            throw new Error("Failed to initiate payment");
        }
    }
}
