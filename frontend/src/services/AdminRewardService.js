// src/services/rewardService.ts
import axiosInstance from "@/utils/axiosInterceptor";
import { AxiosError } from "axios";
export const fetchRewards = async (page, limit, searchTerm) => {
    try {
        const response = await axiosInstance.get(`/admin/rewards?page=${page}&limit=${limit}&search=${searchTerm}`);
        return response.data.data;
    }
    catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        else {
            throw new Error("Failed to fetch rewards");
        }
    }
};
export const deleteReward = async (rewardId) => {
    try {
        await axiosInstance.delete(`/admin/rewards/${rewardId}`);
    }
    catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        else {
            throw new Error("Failed to delete reward");
        }
    }
};
export const fetchReward = async (rewardId) => {
    try {
        const response = await axiosInstance.get(`/admin/reward?rewardId=${rewardId}`);
        return response.data.data;
    }
    catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        else {
            throw new Error("Failed to fetch reward details");
        }
    }
};
// Create or update a reward
export const saveReward = async (rewardId, payload) => {
    try {
        if (rewardId) {
            await axiosInstance.put(`/admin/rewards/${rewardId}`, payload);
        }
        else {
            await axiosInstance.post("/admin/rewards", payload);
        }
    }
    catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data.message);
        }
        else {
            throw new Error("Failed to save reward");
        }
    }
};
