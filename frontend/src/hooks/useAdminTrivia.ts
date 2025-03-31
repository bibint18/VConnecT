import { addTriviaQuestion, fetchTriviaQuestions, ITriviaResponse } from '@/api/adminAuth'
import {keepPreviousData, useMutation, useQuery} from '@tanstack/react-query'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
export const useAddTriviaQuestion = () => {
  return useMutation({
    mutationFn: addTriviaQuestion,
    onSuccess: (data) => {
      console.log("trivia question added",data)
    },
    onError:(error:unknown) => {
      if (error instanceof AxiosError && error.response?.data?.message) {
              console.log(error)
              toast.error(error.response.data.message);
            } else {
              toast.error("add trivia failed");
            }
    }
  })
}

export const useTriviaQuestion = (page:number,limit:number,searchTerm:string) => {
  return useQuery<ITriviaResponse>({
    queryKey:['triviaQuestions',page,limit,searchTerm],
    queryFn: () => fetchTriviaQuestions(page,limit,searchTerm) ,
    // keepPreviousData:true,
    placeholderData:keepPreviousData,
  })
}