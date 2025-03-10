import axios from "axios";


const API_URL = "http://localhost:3000/api/auth"; // Adjust as needed


//USERS API
export const fetchUsers = async (page: number, limit: number) => {
  const response = await axios.get(`${API_URL}/admin/users`, {
    params: { page, limit },
  });
  console.log(response)
  return response.data;
  
};


export const blockUser = async (id: string) => {
  console.log(id)
  const response = await axios.post(`${API_URL}/admin/users/block/${id}`);
  return response.data;
};


export const unblockUser = async (id: string) => {
  const response = await axios.post(`${API_URL}/admin/users/unblock/${id}`);
  return response.data;
};


export const deleteUser = async (id: string) => {
  const response = await axios.post(`${API_URL}/admin/users/delete/${id}`);
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
  const response = await axios.post(`${API_URL}/admin/plans/add`,PlanData)
  return response.data
}

export const fetchPlans = async () => {
  const response = await axios.get(`${API_URL}/admin/plans`)
  return response.data
}

export const findPlanById =async (id:string) => {
  const response = await axios.get(`${API_URL}/admin/plans/${id}`)
  return response.data
}

export const updatePlan = async (id:string,planData:Partial<PlanFormData>) => {
  console.log("update api ",id,planData)
  const response =await axios.put(`${API_URL}/admin/plans/${id}`,planData)
  return response.data
}