import axiosInstance from "@/utils/axiosInterceptor";
import { AxiosError } from "axios";
export interface ITrivia {
  _id: string;
  setNumber: number;
  question: string;
  options: string[];
  correctAnswer: string;
  isDeleted: boolean;
}

interface ITriviaResponse {
  questions: ITrivia[];
}

interface ISubmitAnswerResponse {
  isCorrect: boolean;
  pointsUpdated: boolean;
}

export const fetchDailyTriviaQuestions = async ():Promise<ITrivia[]> => {
  try {
    const response = await axiosInstance.get<ITriviaResponse>('/user/trivia')
    return response.data.questions || []
  } catch (error) {
    if(error instanceof AxiosError && error.response){
      throw new Error(error.response.data.message)
    }else{
      throw new Error("Fetch trivia failled")
    }
  }
}

export const submitTriviaAnswer = async (triviaId:string,submittedAnswer:string):Promise<ISubmitAnswerResponse> => {
  try {
    const response = await axiosInstance.post('/user/trivia/submit',{triviaId,submittedAnswer})
    return response.data
  } catch (error) {
    if(error instanceof AxiosError && error.response){
      throw new Error(error.response.data.message)
    }else{
      throw new Error("submit trivia failled")
    }
  }
}