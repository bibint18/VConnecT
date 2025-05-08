import axiosInstance from "@/utils/axiosInterceptor";
import { AxiosError } from "axios";
export const fetchDailyTriviaQuestions = async () => {
    try {
        const response = await axiosInstance.get('/user/trivia');
        return { questions: response.data.questions || [], point: response.data.user?.point || 0 };
    }
    catch (error) {
        if (error instanceof AxiosError && error.response) {
            throw new Error(error.response.data.message);
        }
        else {
            throw new Error("Fetch trivia failled");
        }
    }
};
export const submitTriviaAnswer = async (triviaId, submittedAnswer) => {
    try {
        const response = await axiosInstance.post('/user/trivia/submit', { triviaId, submittedAnswer });
        return response.data;
    }
    catch (error) {
        if (error instanceof AxiosError && error.response) {
            throw new Error(error.response.data.message);
        }
        else {
            throw new Error("submit trivia failled");
        }
    }
};
