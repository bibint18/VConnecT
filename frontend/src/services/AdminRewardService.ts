import axiosInstance from "@/utils/axiosInterceptor";
import { AxiosError } from "axios";

export interface IReward {
  _id: string;
  rewardId: string;
  title: string;
  description: string;
  type: "room_creation" | "bonus_points";
  value: number;
  requiredPoints?: number;
  requiredStreak?: number;
  isActive: boolean;
  isUnlocked?: boolean;
  isClaimed?: boolean;
}

export const fetchRewards = async (page: number, limit: number, searchTerm: string) => {
  try {
    const response = await axiosInstance.get(`/admin/rewards?page=${page}&limit=${limit}&search=${searchTerm}`);
    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error("Failed to fetch rewards");
    }
  }
};

export const deleteReward = async (rewardId: string) => {
  try {
    await axiosInstance.delete(`/admin/rewards/${rewardId}`);
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error("Failed to delete reward");
    }
  }
};

export const fetchReward = async (rewardId: string) => {
  try {
    const response = await axiosInstance.get(`/admin/reward?rewardId=${rewardId}`);
    return response.data.data;
  } catch (error:unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error("Failed to fetch reward details");
    }
  }
};

export const saveReward = async (rewardId: string | undefined, payload: any) => {
  try {
    if (rewardId) {
      await axiosInstance.put(`/admin/rewards/${rewardId}`, payload);
    } else {
      await axiosInstance.post("/admin/rewards", payload);
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    } else {
      throw new Error("Failed to save reward");
    }
  }
};
