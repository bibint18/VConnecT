import axiosInstance from "@/utils/axiosInterceptor";
export const HomeData = async () => {
    const response = await axiosInstance.get("/HomeData");
    return response.data;
};
