import axiosInstance from "@/utils/axiosInterceptor";
import { AxiosError } from "axios";
export class RewardService {
    async getRewards() {
        try {
            const response = await axiosInstance.get("/rewards");
            console.log("response from fetching rewards", response.data.data);
            return response.data.data;
        }
        catch (error) {
            if (error instanceof AxiosError && error.message) {
                throw new Error(error.response?.data.message);
            }
            throw new Error("Failed to fetch rewards");
        }
    }
    async claimReward(rewardId) {
        try {
            await axiosInstance.post(`/rewards/claim/${rewardId}`);
        }
        catch (error) {
            if (error instanceof AxiosError && error.message) {
                throw new Error(error.response?.data.message);
            }
            throw new Error("Failed to claim reward");
        }
    }
    async checkIn() {
        try {
            await axiosInstance.post("/user/checkin");
        }
        catch (error) {
            if (error instanceof AxiosError && error.message) {
                throw new Error(error.response?.data.message);
            }
            throw new Error("Failed to checkin");
        }
    }
    async getUserDetails(userId) {
        try {
            const response = await axiosInstance.get(`/user/details/${userId}`);
            return response.data.data;
        }
        catch (error) {
            if (error instanceof AxiosError && error.message) {
                throw new Error(error.response?.data.message);
            }
            throw new Error("Failed to fetch details");
        }
    }
}
