

// "use client"

// import { useState } from "react"
// import { Search, ChevronDown, BarChart2, Edit, Trash2, ChevronRight } from "lucide-react"
// // import Image from "next/image"
// import './customerDashboard.css'
// export default function CustomerDashboard() {
//   const [customers, setCustomers] = useState([
//     {
//       id: "01",
//       name: "Joh Doe",
//       email: "Devloper@gmail.com",
//       plan: "Platinum",
//       access: true,
//       avatar: "/placeholder.svg?height=40&width=40",
//     },
//     {
//       id: "02",
//       name: "Shubham",
//       email: "shubham@gmail.com",
//       plan: "Platinum",
//       access: false,
//       avatar: "/placeholder.svg?height=40&width=40",
//     },
//     {
//       id: "03",
//       name: "Sarah Johnson",
//       email: "sarah@example.com",
//       plan: "Gold",
//       access: true,
//       avatar: "/placeholder.svg?height=40&width=40",
//     },
//     {
//       id: "04",
//       name: "Michael Chen",
//       email: "michael@example.com",
//       plan: "Platinum",
//       access: true,
//       avatar: "/placeholder.svg?height=40&width=40",
//     },
//   ])

//   const topCustomers = [
//     {
//       name: "Devloper",
//       streak: "100 days streak",
//       avatar: "/placeholder.svg?height=40&width=40",
//     },
//     {
//       name: "Devloper",
//       streak: "1 min ago",
//       avatar: "/placeholder.svg?height=40&width=40",
//     },
//   ]

//   const toggleAccess = (id: string) => {
//     setCustomers(
//       customers.map((customer) => (customer.id === id ? { ...customer, access: !customer.access } : customer)),
//     )
//   }

//   return (
//     <div className="flex-1 min-h-screen bg-[#faf7f2] p-6 flex flex-col">
//       <div className="mx-auto max-w-7xl">
//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
//           {/* Main content - 3/4 width on large screens */}
//           <div className="lg:col-span-3">
//             <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
//               {/* Search bar */}
//               <div className="relative w-full max-w-md">
//                 <input
//                   type="text"
//                   placeholder="Search users here"
//                   className="w-full rounded-full border-0 bg-white py-2 pl-4 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//                 />
//                 <Search className="absolute right-3 top-2.5 h-5 w-5 text-orange-500" />
//               </div>

//               {/* Sort options */}
//               <div className="flex items-center gap-4">
//                 <div className="flex items-center gap-2 text-gray-600">
//                   <BarChart2 className="h-5 w-5 text-orange-500" />
//                   <span>Sort By</span>
//                 </div>
//                 <div className="flex items-center gap-1 font-medium">
//                   <span>Name</span>
//                   <ChevronDown className="h-4 w-4" />
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <BarChart2 className="h-5 w-5 text-orange-500" />
//                   <span>Points</span>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <span className="text-orange-500">streaks</span>
//                 </div>
//               </div>
//             </div>

//             {/* Table */}
//             <div className="overflow-x-auto rounded-lg bg-white shadow">
//               <table className="w-full">
//                 <thead>
//                   <tr>
//                     <th className="rounded-tl-lg bg-[#fce7d9] px-4 py-3 text-left text-sm font-medium text-gray-700">
//                       S. Number
//                     </th>
//                     <th className="bg-[#fce7d9] px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
//                     <th className="bg-[#fce7d9] px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
//                     <th className="bg-[#fce7d9] px-4 py-3 text-left text-sm font-medium text-gray-700">Plan</th>
//                     <th className="bg-[#fce7d9] px-4 py-3 text-left text-sm font-medium text-gray-700">Access</th>
//                     <th className="rounded-tr-lg bg-[#fce7d9] px-4 py-3 text-left text-sm font-medium text-gray-700">
//                       Update
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {customers.map((customer) => (
//                     <tr key={customer.id} className="border-b border-gray-100 last:border-0">
//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-2">
//                           <div className="h-8 w-8 overflow-hidden rounded-full">
//                             <img
//                               src={customer.avatar || "/placeholder.svg"}
//                               alt={customer.name}
//                               width={32}
//                               height={32}
//                               className="h-full w-full object-cover"
//                             />
//                           </div>
//                           <span className="font-bold">{customer.id}</span>
//                         </div>
//                       </td>
//                       <td className="px-4 py-3">{customer.name}</td>
//                       <td className="px-4 py-3">{customer.email}</td>
//                       <td className="px-4 py-3">{customer.plan}</td>
//                       <td className="px-4 py-3">
//                         <button
//                           onClick={() => toggleAccess(customer.id)}
//                           className={`relative inline-flex h-6 w-12 items-center rounded-full ${
//                             customer.access ? "bg-green-500" : "bg-gray-700"
//                           }`}
//                         >
//                           <span
//                             className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
//                               customer.access ? "translate-x-7" : "translate-x-1"
//                             }`}
//                           />
//                         </button>
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-2">
//                           <button className="rounded-full p-1 text-gray-500 hover:bg-gray-100">
//                             <Edit className="h-5 w-5" />
//                           </button>
//                           <button className="rounded-full p-1 text-red-500 hover:bg-gray-100">
//                             <Trash2 className="h-5 w-5" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             <div className="mt-4 flex items-center justify-center gap-2">
//               <button className="rounded-full bg-gray-200 px-6 py-2 text-sm font-medium">Page 01</button>
//               <button className="rounded-full bg-gray-200 p-2">
//                 <ChevronRight className="h-4 w-4" />
//               </button>
//             </div>
//           </div>

//           {/* Sidebar - 1/4 width on large screens */}
//           <div className="lg:col-span-1">
//             <div className="rounded-lg bg-white p-4 shadow">
//               <h2 className="mb-4 text-xl font-medium text-gray-700">Top Customers</h2>
//               <div className="space-y-4">
//                 {topCustomers.map((customer, index) => (
//                   <div key={index} className="flex items-center gap-3">
//                     <div className="h-10 w-10 overflow-hidden rounded-full">
//                       <img
//                         src={customer.avatar || "/placeholder.svg"}
//                         alt={customer.name}
//                         width={40}
//                         height={40}
//                         className="h-full w-full object-cover"
//                       />
//                     </div>
//                     <div>
//                       <h3 className="font-medium">{customer.name}</h3>
//                       <p className="text-sm text-gray-500">{customer.streak}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


// "use client"

// import { useState } from "react"
// import { Search, ChevronDown, BarChart2, Edit, Trash2, ChevronRight, ChevronLeft } from "lucide-react"
// import './customerDashboard.css'

// export default function CustomerDashboard() {
//   const [customers, setCustomers] = useState([
//     {
//       id: "01",
//       name: "John Doe",
//       email: "developer@gmail.com",
//       plan: "Platinum",
//       access: true,
//       avatar: "/placeholder.svg?height=40&width=40",
//     },
//     {
//       id: "02",
//       name: "Shubham",
//       email: "shubham@gmail.com",
//       plan: "Platinum",
//       access: false,
//       avatar: "/placeholder.svg?height=40&width=40",
//     },
//     {
//       id: "03",
//       name: "Sarah Johnson",
//       email: "sarah@example.com",
//       plan: "Gold",
//       access: true,
//       avatar: "/placeholder.svg?height=40&width=40",
//     },
//     {
//       id: "04",
//       name: "Michael Chen",
//       email: "michael@example.com",
//       plan: "Platinum",
//       access: true,
//       avatar: "/placeholder.svg?height=40&width=40",
//     },
//   ])

//   const topCustomers = [
//     {
//       name: "Developer",
//       streak: "100 days streak",
//       avatar: "/placeholder.svg?height=40&width=40",
//     },
//     {
//       name: "Developer",
//       streak: "1 min ago",
//       avatar: "/placeholder.svg?height=40&width=40",
//     },
//   ]

//   const toggleAccess = (id: string) => {
//     setCustomers(
//       customers.map((customer) => (customer.id === id ? { ...customer, access: !customer.access } : customer)),
//     )
//   }

//   return (
//     <div className="customer-dashboard flex-1">
//       <div className="container">
//         <div className="grid-layout">
//           <div>
//             <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
//               <div className="search-container">
//                 <input
//                   type="text"
//                   placeholder="Search users here"
//                   className="search-input"
//                 />
//                 <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-500" />
//               </div>

//               <div className="sort-options">
//                 <div className="sort-item">
//                   <BarChart2 className="h-5 w-5 text-orange-500" />
//                   <span>Sort By</span>
//                 </div>
//                 <div className="sort-item">
//                   <span>Name</span>
//                   <ChevronDown className="h-4 w-4" />
//                 </div>
//                 <div className="sort-item">
//                   <BarChart2 className="h-5 w-5 text-orange-500" />
//                   <span>Points</span>
//                 </div>
//                 <div className="sort-item">
//                   <span>Streaks</span>
//                 </div>
//               </div>
//             </div>

//             <div className="table-container">
//               <table className="w-full">
//                 <thead>
//                   <tr className="table-header">
//                     <th className="rounded-tl-lg px-4 py-3 text-left text-sm">S. Number</th>
//                     <th className="px-4 py-3 text-left text-sm">Name</th>
//                     <th className="px-4 py-3 text-left text-sm">Email</th>
//                     <th className="px-4 py-3 text-left text-sm">Plan</th>
//                     <th className="px-4 py-3 text-left text-sm">Access</th>
//                     <th className="rounded-tr-lg px-4 py-3 text-left text-sm">Update</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {customers.map((customer) => (
//                     <tr key={customer.id} className="table-row border-b border-gray-100 last:border-0">
//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-2">
//                           <div className="h-8 w-8 overflow-hidden rounded-full">
//                             <img src={customer.avatar} alt={customer.name} width={32} height={32} className="h-full w-full object-cover" />
//                           </div>
//                           <span className="font-bold">{customer.id}</span>
//                         </div>
//                       </td>
//                       <td className="px-4 py-3">{customer.name}</td>
//                       <td className="px-4 py-3">{customer.email}</td>
//                       <td className="px-4 py-3">{customer.plan}</td>
//                       <td className="px-4 py-3">
//                         <button
//                           onClick={() => toggleAccess(customer.id)}
//                           className={`access-toggle ${customer.access ? "bg-green-500" : "bg-red-500"}`}
//                         >
//                           <span className={customer.access ? "translate-x-6" : "translate-x-1"} />
//                         </button>
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-2">
//                           <button className="action-button edit-button">
//                             <Edit className="h-5 w-5" />
//                           </button>
//                           <button className="action-button delete-button">
//                             <Trash2 className="h-5 w-5" />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             <div className="pagination">
//               <button className="page-button page-button-inactive">
//                 <ChevronLeft className="h-4 w-4" />
//               </button>
//               <button className="page-button page-button-active">1</button>
//               <button className="page-button page-button-inactive">2</button>
//               <button className="page-button page-button-inactive">3</button>
//               <button className="page-button page-button-inactive">
//                 <ChevronRight className="h-4 w-4" />
//               </button>
//             </div>
//           </div>

//           <div className="sidebar">
//             <h2 className="mb-4 text-xl font-medium text-gray-700">Top Customers</h2>
//             <div className="space-y-4">
//               {topCustomers.map((customer, index) => (
//                 <div key={index} className="top-customer">
//                   <div className="h-10 w-10 overflow-hidden rounded-full">
//                     <img src={customer.avatar} alt={customer.name} width={40} height={40} className="h-full w-full object-cover" />
//                   </div>
//                   <div>
//                     <h3 className="font-medium">{customer.name}</h3>
//                     <p className="text-sm text-gray-500">{customer.streak}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }





"use client"
interface User{
  _id:string;
  name:string,
  email:string,
  password:string,
  otp?:string,
  otpExpiry?:Date,
  isVerified:boolean
  isAdmin:boolean
  failedLoginAttempts: number;
  lockUntil: Date | null;
  plan:string;
  isDeleted:boolean;
  isBlocked:boolean
}

interface useUserResponse{
  data:User[] | undefined,
  isLoading:boolean;
  isError:boolean
}
import { useState } from "react"
import { Search, ChevronDown, BarChart2, Edit, Trash2, ChevronRight, ChevronLeft } from "lucide-react"
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
  const {data:users,isLoading,isError} = useUsers(page,limit,searchTerm,sortOption) as useUserResponse
  const handleBlock = (id:string) => {
    console.log("handleBlock: ",id)
    blockMutation.mutate(id)
  }
  const handleUnblock = (id:string) => {
    unblockMutation.mutate(id)
  }

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

  if(isLoading) return <p>Loading users...</p>
  if(isError) return <p>Error fetching users..</p>
//  const filteredUsers:User[] = users ? users?.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase())) : []

//  const sortedUsers: User[] = [...filteredUsers].sort((a,b) => {
//   if(sortOption === "A-Z"){
//     return a.name.localeCompare(b.name)
//   }else if(sortOption === 'Z-A'){
//     return b.name.localeCompare(a.name)
//   }else if(sortOption === 'recent'){
//     return new Date(b._id).getTime() - new Date(a._id).getTime()
//   }
//   return 0
  
//  })

  return (
    <div className="customer-dashboard flex-1">
      <div className="container">
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
                    <ChevronDown className="h-4 w-4" />
                    <option className="text-black" value="A-Z">A-Z</option>
    <option className="text-black " value="Z-A">Z-A</option>
    <option className="text-black " value="recent">Recently Joined</option>
                  </select>
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
                
                {users?.length > 0 ? ( users?.map((user: User,index:number) => (
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
                      <td className="px-4 py-3">{user.plan}</td>
                      {/* <td className="px-4 py-3">
                        <button
                          onClick={() => toggleAccess(user.id)}
                          className={`status-button ${
                            user.access ? "status-unblocked" : "status-blocked"
                          }`}
                        >
                          {user.access ? "Unblocked" : "Blocked"}
                        </button>
                      </td> */}

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
                          <button className="action-button edit-button">
                            <Edit className="h-5 w-5" />
                          </button>
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

            {/* <div className="pagination">
              <button className="page-button page-button-inactive">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="page-button page-button-active">1</button>
              <button className="page-button page-button-inactive">2</button>
              <button className="page-button page-button-inactive">3</button>
              <button className="page-button page-button-inactive">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div> */}

            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage((prev) => prev - 1)} className="page-button">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-3 py-2">{page}</span>
              <button onClick={() => setPage((prev) => prev + 1)} className="page-button">
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
      </div>
    </div>
  )
}