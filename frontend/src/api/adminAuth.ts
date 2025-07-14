
import { UserActionResponseDTO, UsersResponseDTO } from "@/types/AdminUserDTO";
import axiosInstance from "../utils/axiosInterceptor";


//USERS API
export const fetchUsers = async (page: number, limit: number,searchTerm:string,sortOption:string):Promise<UsersResponseDTO> => {
  const response = await axiosInstance.get(`/admin/users`, {
    params: { page, limit ,searchTerm,sortOption},
    withCredentials:true
  });
  console.log("from auth",response.data)
  return response.data; 
};


export const blockUser = async (id: string):Promise<UserActionResponseDTO> => {
  console.log(id)
  const response = await axiosInstance.post(`/admin/users/block/${id}`);
  return response.data;
};


export const unblockUser = async (id: string):Promise<UserActionResponseDTO> => {
  const response = await axiosInstance.post(`/admin/users/unblock/${id}`);
  return response.data;
};


export const deleteUser = async (id: string):Promise<UserActionResponseDTO> => {
  const response = await axiosInstance.post(`/admin/users/delete/${id}`);
  return response.data;
};




//PLANS API
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
export const addNewPlan = async(PlanData:PlanFormData) =>{
  const response = await axiosInstance.post(`/admin/plans/add`,PlanData)
  return response.data
}

export const fetchPlans = async (page=1,limit=4,search='',sort='A-Z') => {
  const response = await axiosInstance.get(`/admin/plans`,{params:{page,limit,search,sort}})
  console.log("fetching plans response api ",response.data)
  return response.data
}

export const findPlanById =async (id:string) => {
  const response = await axiosInstance.get(`/admin/plans/${id}`)
  return response.data
}

export const updatePlan = async (id:string,planData:Partial<PlanFormData>) => {
  console.log("update api ",id,planData)
  const response =await axiosInstance.put(`/admin/plans/edit/${id}`,planData)
  return response.data
}

export const deletePlan = async (id:string) => {
  const response = await axiosInstance.post(`/admin/plans/delete/${id}`)
  return response.data
}




//Rooms
export interface IParticipant {
  userId: { _id: string; name: string; email: string };
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
  type: "public" | "private" ; 
}

export interface RoomsResponse {
  rooms: Room[];
  totalRooms: number;
}

export const fetchRooms = async (page: number, limit: number, searchTerm: string, sortOption: string): Promise<RoomsResponse> => {
  const response = await axiosInstance.get(`/admin/rooms`, {
    params: { page, limit, searchTerm, sortOption },
    withCredentials: true,
  });
  return response.data;
};

export const blockRoom = async (id: string) => {
  const response = await axiosInstance.post(`/admin/rooms/block/${id}`);
  return response.data;
};

export const unblockRoom = async (id: string) => {
  const response = await axiosInstance.post(`/admin/rooms/unblock/${id}`);
  return response.data;
};

export const deleteRoom = async (id: string) => {
  const response = await axiosInstance.post(`/admin/rooms/delete/${id}`);
  return response.data;
};


//daily trivia

export interface TriviaData{
  question:string;
  options:string[];
  correctAnswer:string;
}

export interface ITrivia{
  _id:string;
  setNumber:number;
  question:string;
  correctAnswer:string;
  isDeleted:boolean;
  options:string[];
}

export interface ITriviaResponse {
  questions: ITrivia[];
  total: number;
}

export const addTriviaQuestion = async (data:TriviaData) => {
  const response = await axiosInstance.post('/admin/trivia',data)
  return response.data
}

export const fetchTriviaQuestions = async (page:number,limit:number,searchTerm:string): Promise<ITriviaResponse> => {
  const response = await axiosInstance.get('/admin/trivia',{params:{page,limit,searchTerm},withCredentials:true})
  return response.data
}

export const fetchTriviaQuestionById = async (id:string):Promise<ITrivia> => {
  const response = await axiosInstance.get(`/admin/trivia/${id}`)
   console.log('data from frontend',response.data)
  return response.data.trivia
}

export const updateTriviaQuestion = async (id:string,data:TriviaData) => {
  const response = await axiosInstance.put(`/admin/trivia/update/${id}`,data)
  return response.data
}

export const deleteTriviaQuestion =async (id:string) => {
  const response = await axiosInstance.delete(`/admin/trivia/delete/${id}`)
  return response.data
}