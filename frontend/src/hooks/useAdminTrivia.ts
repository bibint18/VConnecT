import { addTriviaQuestion, deleteTriviaQuestion, fetchTriviaQuestionById, fetchTriviaQuestions, ITrivia, ITriviaResponse, TriviaData, updateTriviaQuestion } from '@/api/adminAuth'
import { useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
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
    placeholderData:{questions:[],total:0},
  })
}

export const useTriviaQuestionById = (id: string) => {
  return useQuery<ITrivia>({
    queryKey: ["triviaQuestion", id],
    queryFn: () => fetchTriviaQuestionById(id),
    enabled: !!id, // Only fetch if ID is provided
  });
};

export const useUpdateTriviaQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TriviaData }) => updateTriviaQuestion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["triviaQuestions"] });
      queryClient.invalidateQueries({ queryKey: ["triviaQuestion"] });
      console.log("Trivia question updated");
    },
    onError: (error:unknown) =>{
      if (error instanceof AxiosError && error.response?.data?.message) {
        console.log(error)
        toast.error(error.response.data.message);
      } else {
        toast.error("add trivia failed");
      }
    }
  });
};


export const useDeleteTriviaQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTriviaQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["triviaQuestions"] });
      console.log("Trivia question deleted");
    },
    onError: (error: unknown) =>{
      if (error instanceof AxiosError && error.response?.data?.message) {
        console.log(error)
        toast.error(error.response.data.message);
      } else {
        toast.error("delete trivia failed");
      }
    }
  });
};