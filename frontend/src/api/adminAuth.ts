
import axiosInstance from "../utils/axiosInterceptor";

const API_URL = "http://localhost:3000/api/auth"; 


//USERS API
export const fetchUsers = async (page: number, limit: number,searchTerm:string,sortOption:string) => {
  const response = await axiosInstance.get(`/admin/users`, {
    params: { page, limit ,searchTerm,sortOption},
    withCredentials:true
  });
  console.log("from auth",response.data)
  return response.data; 
};


export const blockUser = async (id: string) => {
  console.log(id)
  const response = await axiosInstance.post(`/admin/users/block/${id}`);
  return response.data;
};


export const unblockUser = async (id: string) => {
  const response = await axiosInstance.post(`/admin/users/unblock/${id}`);
  return response.data;
};


export const deleteUser = async (id: string) => {
  const response = await axiosInstance.post(`/admin/users/delete/${id}`);
  return response.data;
};




//PLANS API
export interface PlanFormData {
  name: string;
  type: string;
  description: string;
  regularAmount: number;
  discountAmount: number;
  benefits: string[];
  isListed: boolean;
  duration: string;
}
export const addNewPlan = async(PlanData:PlanFormData) =>{
  const response = await axiosInstance.post(`${API_URL}/admin/plans/add`,PlanData)
  return response.data
}

export const fetchPlans = async (page=1,limit=4,search='',sort='A-Z') => {
  const response = await axiosInstance.get(`${API_URL}/admin/plans`,{params:{page,limit,search,sort}})
  console.log("fetching plans response api ",response.data)
  return response.data
}

export const findPlanById =async (id:string) => {
  const response = await axiosInstance.get(`${API_URL}/admin/plans/${id}`)
  return response.data
}

export const updatePlan = async (id:string,planData:Partial<PlanFormData>) => {
  console.log("update api ",id,planData)
  const response =await axiosInstance.put(`${API_URL}/admin/plans/edit/${id}`,planData)
  return response.data
}

export const deletePlan = async (id:string) => {
  const response = await axiosInstance.post(`${API_URL}/admin/plans/delete/${id}`)
  return response.data
}




//Rooms
export interface Room {
  _id: string;
  title: string;
  createdBy: string; // User ID
  limit: number;
  participants: string[]; // Array of User IDs
  createdAt: Date;
  isDeleted?: boolean;
  isBlocked: boolean; // New field for blocking
  type: "public" | "private" | "premium"; // New field for room type
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