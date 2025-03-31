import { addTriviaQuestion } from '@/api/adminAuth'
import {useMutation} from '@tanstack/react-query'
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
              toast.error("Signup failed");
            }
    }
  })
}