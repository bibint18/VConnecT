export declare const fetchUsers: (page: number, limit: number, searchTerm: string, sortOption: string) => Promise<any>;
export declare const blockUser: (id: string) => Promise<any>;
export declare const unblockUser: (id: string) => Promise<any>;
export declare const deleteUser: (id: string) => Promise<any>;
export interface PlanFormData {
    name: string;
    type: 'paid' | 'free';
    description: string;
    regularAmount: number;
    discountAmount: number;
    benefits: string[];
    isListed: boolean;
    duration: '1 month' | '3 months' | '6 months' | '9 months' | '12 months';
    roomBenefit: number;
}
export declare const addNewPlan: (PlanData: PlanFormData) => Promise<any>;
export declare const fetchPlans: (page?: number, limit?: number, search?: string, sort?: string) => Promise<any>;
export declare const findPlanById: (id: string) => Promise<any>;
export declare const updatePlan: (id: string, planData: Partial<PlanFormData>) => Promise<any>;
export declare const deletePlan: (id: string) => Promise<any>;
export interface IParticipant {
    userId: {
        _id: string;
        name: string;
        email: string;
    };
    firstJoin: Date;
    lastJoin: Date;
    lastLeave: Date | null;
    totalDuration: number;
}
export interface Room {
    _id: string;
    title: string;
    createdBy: string;
    limit: number;
    participants: IParticipant[];
    createdAt: Date;
    isDeleted?: boolean;
    isBlocked: boolean;
    type: "public" | "private";
}
export interface RoomsResponse {
    rooms: Room[];
    totalRooms: number;
}
export declare const fetchRooms: (page: number, limit: number, searchTerm: string, sortOption: string) => Promise<RoomsResponse>;
export declare const blockRoom: (id: string) => Promise<any>;
export declare const unblockRoom: (id: string) => Promise<any>;
export declare const deleteRoom: (id: string) => Promise<any>;
export interface TriviaData {
    question: string;
    options: string[];
    correctAnswer: string;
}
export interface ITrivia {
    _id: string;
    setNumber: number;
    question: string;
    correctAnswer: string;
    isDeleted: boolean;
    options: string[];
}
export interface ITriviaResponse {
    questions: ITrivia[];
    total: number;
}
export declare const addTriviaQuestion: (data: TriviaData) => Promise<any>;
export declare const fetchTriviaQuestions: (page: number, limit: number, searchTerm: string) => Promise<ITriviaResponse>;
export declare const fetchTriviaQuestionById: (id: string) => Promise<ITrivia>;
export declare const updateTriviaQuestion: (id: string, data: TriviaData) => Promise<any>;
export declare const deleteTriviaQuestion: (id: string) => Promise<any>;
