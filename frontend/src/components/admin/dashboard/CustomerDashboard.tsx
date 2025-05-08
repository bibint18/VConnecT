
"use client"
export interface IUser{
  _id:string;
  name:string,
  email:string,
  password:string,
  profileImage?:string,
  username?:string,
  otp?:string,
  otpExpiry?:Date,
  isVerified:boolean
  isAdmin:boolean
  failedLoginAttempts: number;
  lockUntil: Date | null;
  plan?: {
    planId: string;
    planName: string;
    status: "active" | "expired" | "cancelled";
    startDate: Date;
    endDate?: Date;
    transactionId?: string;
  }[];
  isDeleted:boolean;
  isBlocked:boolean;
  point?:number;
  streak?:number;
  availableRoomLimit?:number;
  friends?: string[];
}

import { useState } from "react"
import { Search, BarChart2, Trash2, ChevronRight, ChevronLeft } from "lucide-react"
import './customerDashboard.css'
import { useUsers,useBlockUser,useDeleteUser,useUnblockUser } from "../../../hooks/useUsers"
import Swal from "sweetalert2";
export default function CustomerDashboard() {
  const [page,setPage] = useState(1)
  const limit=6
  
  const blockMutation = useBlockUser()
  const unblockMutation = useUnblockUser()
  const deleteMutation = useDeleteUser()
  const [searchTerm,setSearchTerm] = useState('')
  const [sortOption,setSortOption] = useState<string>("A-Z")
  const { data, isLoading, isError } = useUsers(page, limit, searchTerm, sortOption);
  console.log("data from component ",data)
  const users: IUser[] = data?.users ?? []; 
  const totalUsers: number = data?.totalUsers ?? 0; 
const totalPages = Math.ceil(totalUsers/limit)
  console.log("totalCount",totalPages)
  const handleBlock = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to block this user?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Block",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        blockMutation.mutate(id, {
          onSuccess: () => {
            Swal.fire("Blocked!", "The user has been blocked.", "success");
          },
          onError: () => {
            Swal.fire("Error!", "Something went wrong.", "error");
          },
        });
      }
    });
  };
  const handleUnblock = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to unblock this user?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#28a745",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Unblock",
      cancelButtonText: "Cancel"
    }).then((result) => {
      if (result.isConfirmed) {
        unblockMutation.mutate(id, {
          onSuccess: () => {
            Swal.fire("Unblocked!", "The user has been unblocked.", "success");
          },
          onError: () => {
            Swal.fire("Error!", "Something went wrong.", "error");
          },
        });
      }
    });
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id, {
          onSuccess: () => {
            Swal.fire("Deleted!", "The user has been deleted.", "success");
          },
          onError: () => {
            Swal.fire("Error!", "Something went wrong.", "error");
          },
        });
      }
    });
  };

  const getActivePlanName = (plans: IUser['plan']) => {
    
    if(plans){
     const activePlan = plans.find(plan => plan.status === "active");
    return activePlan ? activePlan.planName : "No Active Plan";
    }
    
  };

  if(isLoading) return <p>Loading users...</p>
  if(isError) return <p>Error fetching users..</p>
  return (
    <div className="customer-dashboard flex-1">
      {/* <div className="container"> */}
        <div className="grid-layout">
          <div>
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search users here"
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  //venenkile refetch
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-500" />
              </div>

              <div className="sort-options">
                <div className="sort-item">
                  <BarChart2 className="h-5 w-5 text-orange-500" />
                  <span>Sort By</span>
                </div>
                <div className="sort-item">
                  <select className="outline-none"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option className="text-black" value="A-Z">A-Z</option>
    <option className="text-black " value="Z-A">Z-A</option>
    <option className="text-black " value="recent">Recently Joined</option>
                  </select>
                  {/* <ChevronDown className="h-4 w-4" /> */}

                </div>

                {/* <div className="sort-item">
                  <BarChart2 className="h-5 w-5 text-orange-500" />
                  <span>Points</span>
                </div> */}
                {/* <div className="sort-item">
                  <span>Streaks</span>
                </div> */}
              </div>
            </div>

            <div className="table-container">
              <table className="w-full">
                <thead>
                  <tr className="table-header">
                    <th className="rounded-tl-lg px-4 py-3 text-left text-sm">S. Number</th>
                    <th className="px-4 py-3 text-left text-sm">Name</th>
                    <th className="px-4 py-3 text-left text-sm">Email</th>
                    <th className="px-4 py-3 text-left text-sm">Plan</th>
                    <th className="px-4 py-3 text-left text-sm">Status</th>
                    <th className="rounded-tr-lg px-4 py-3 text-left text-sm">Update</th>
                  </tr>
                </thead>
                <tbody>
                
                {users?.length > 0 ? ( users?.map((user: IUser,index:number) => (
                    <tr key={user._id} className="table-row border-b border-gray-100 last:border-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 overflow-hidden rounded-full">
                            {/* <img src={user.avatar} alt={user.name} width={32} height={32} className="h-full w-full object-cover" /> */}
                          </div>
                          <span className="font-bold">{index+1}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{user.name}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">{getActivePlanName(user.plan)}</td>
                      

                        <td className="px-4 py-3">
                        {user.isBlocked ? (
                          <button onClick={() => handleUnblock(user._id)} className="status-button status-blocked">
                            Unblock
                          </button>
                        ) : (
                          <button onClick={() => handleBlock(user._id)} className="status-button status-unblocked">
                            Block
                          </button>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {/* <button className="action-button edit-button">
                            <Edit className="h-5 w-5" />
                          </button> */}
                          <button  onClick={() => handleDelete(user._id)} className="action-button delete-button">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))): (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-gray-500">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>


            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage((prev) => prev - 1)} className="page-button">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-3 py-2">{page}</span>
              <button disabled={page >= totalPages} 
    onClick={() => setPage((prev) => prev + 1)} 
    className="page-button">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

          </div>

          {/* <div className="sidebar">
            <h2 className="mb-4 text-xl font-medium text-gray-700">Top Customers</h2>
            <div className="space-y-4">
              {topCustomers.map((customer, index) => (
                <div key={index} className="top-customer">
                  <div className="h-10 w-10 overflow-hidden rounded-full">
                    <img src={customer.avatar} alt={customer.name} width={40} height={40} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-medium">{customer.name}</h3>
                    <p className="text-sm text-gray-500">{customer.streak}</p>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      {/* </div> */}
    </div>
  )
}