import { ITrivia, ITriviaResponse, TriviaData } from '@/api/adminAuth';
export declare const useAddTriviaQuestion: () => import("@tanstack/react-query").UseMutationResult<any, unknown, TriviaData, unknown>;
export declare const useTriviaQuestion: (page: number, limit: number, searchTerm: string) => import("@tanstack/react-query").UseQueryResult<ITriviaResponse, unknown>;
export declare const useTriviaQuestionById: (id: string) => import("@tanstack/react-query").UseQueryResult<ITrivia, unknown>;
export declare const useUpdateTriviaQuestion: () => import("@tanstack/react-query").UseMutationResult<any, unknown, {
    id: string;
    data: TriviaData;
}, unknown>;
export declare const useDeleteTriviaQuestion: () => import("@tanstack/react-query").UseMutationResult<any, unknown, string, unknown>;
