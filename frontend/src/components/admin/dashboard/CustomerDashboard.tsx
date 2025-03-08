// components/admin/mainContent/MainContent.tsx
// const MainContent: React.FC = () => {
//   return (
//     <div className="flex-1 bg-black p-4 overflow-auto ">
//       <h1 className="text-2xl font-semibold text-white text-center">Admin Dashboard Content</h1>
//     </div>
//   );
// };

// export default MainContent;




"use client"

import { useState } from "react"
import { Search, ChevronDown, BarChart2, Edit, Trash2, ChevronRight } from "lucide-react"
// import Image from "next/image"
import './customerDashboard.css'
export default function CustomerDashboard() {
  const [customers, setCustomers] = useState([
    {
      id: "01",
      name: "Joh Doe",
      email: "Devloper@gmail.com",
      plan: "Platinum",
      access: true,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "02",
      name: "Shubham",
      email: "shubham@gmail.com",
      plan: "Platinum",
      access: false,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "03",
      name: "Sarah Johnson",
      email: "sarah@example.com",
      plan: "Gold",
      access: true,
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "04",
      name: "Michael Chen",
      email: "michael@example.com",
      plan: "Platinum",
      access: true,
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ])

  const topCustomers = [
    {
      name: "Devloper",
      streak: "100 days streak",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      name: "Devloper",
      streak: "1 min ago",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const toggleAccess = (id: string) => {
    setCustomers(
      customers.map((customer) => (customer.id === id ? { ...customer, access: !customer.access } : customer)),
    )
  }

  return (
    <div className="flex-1 min-h-screen bg-[#faf7f2] p-6 flex flex-col">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Main content - 3/4 width on large screens */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              {/* Search bar */}
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Search users here"
                  className="w-full rounded-full border-0 bg-white py-2 pl-4 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-orange-500" />
              </div>

              {/* Sort options */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <BarChart2 className="h-5 w-5 text-orange-500" />
                  <span>Sort By</span>
                </div>
                <div className="flex items-center gap-1 font-medium">
                  <span>Name</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-orange-500" />
                  <span>Points</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-orange-500">streaks</span>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg bg-white shadow">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="rounded-tl-lg bg-[#fce7d9] px-4 py-3 text-left text-sm font-medium text-gray-700">
                      S. Number
                    </th>
                    <th className="bg-[#fce7d9] px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                    <th className="bg-[#fce7d9] px-4 py-3 text-left text-sm font-medium text-gray-700">Email</th>
                    <th className="bg-[#fce7d9] px-4 py-3 text-left text-sm font-medium text-gray-700">Plan</th>
                    <th className="bg-[#fce7d9] px-4 py-3 text-left text-sm font-medium text-gray-700">Access</th>
                    <th className="rounded-tr-lg bg-[#fce7d9] px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Update
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="border-b border-gray-100 last:border-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 overflow-hidden rounded-full">
                            <img
                              src={customer.avatar || "/placeholder.svg"}
                              alt={customer.name}
                              width={32}
                              height={32}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <span className="font-bold">{customer.id}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{customer.name}</td>
                      <td className="px-4 py-3">{customer.email}</td>
                      <td className="px-4 py-3">{customer.plan}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleAccess(customer.id)}
                          className={`relative inline-flex h-6 w-12 items-center rounded-full ${
                            customer.access ? "bg-green-500" : "bg-gray-700"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                              customer.access ? "translate-x-7" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button className="rounded-full p-1 text-gray-500 hover:bg-gray-100">
                            <Edit className="h-5 w-5" />
                          </button>
                          <button className="rounded-full p-1 text-red-500 hover:bg-gray-100">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex items-center justify-center gap-2">
              <button className="rounded-full bg-gray-200 px-6 py-2 text-sm font-medium">Page 01</button>
              <button className="rounded-full bg-gray-200 p-2">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Sidebar - 1/4 width on large screens */}
          <div className="lg:col-span-1">
            <div className="rounded-lg bg-white p-4 shadow">
              <h2 className="mb-4 text-xl font-medium text-gray-700">Top Customers</h2>
              <div className="space-y-4">
                {topCustomers.map((customer, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full">
                      <img
                        src={customer.avatar || "/placeholder.svg"}
                        alt={customer.name}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{customer.name}</h3>
                      <p className="text-sm text-gray-500">{customer.streak}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


// "use client"

// import { useState } from "react"
// import { Search, ChevronDown, BarChart2, Edit, Trash2, ChevronRight } from "lucide-react"
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
//     <div className="min-h-screen bg-[#faf7f2] p-4 sm:p-6">
//       <div className="mx-auto max-w-7xl">
//         <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
//           {/* Main Content */}
//           <div className="lg:col-span-3">
//             {/* Header */}
//             <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
//               {/* Search Bar */}
//               <div className="relative w-full max-w-md">
//                 <input
//                   type="text"
//                   placeholder="Search users here"
//                   className="w-full rounded-full border-0 bg-white py-2 pl-4 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
//                 />
//                 <Search className="absolute right-3 top-2.5 h-5 w-5 text-orange-500" />
//               </div>

//               {/* Sort Options */}
//               <div className="flex flex-wrap items-center gap-4">
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
//                   <span className="text-orange-500">Streaks</span>
//                 </div>
//               </div>
//             </div>

//             {/* Table */}
//             <div className="overflow-hidden rounded-lg bg-white shadow">
//               {/* Desktop Table */}
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
//                     <tr key={customer.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50">
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
//                           className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
//                             customer.access ? "bg-green-500" : "bg-gray-300"
//                           }`}
//                           aria-label={`Toggle access for ${customer.name}`}
//                         >
//                           <span
//                             className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                               customer.access ? "translate-x-7" : "translate-x-1"
//                             }`}
//                           />
//                         </button>
//                       </td>
//                       <td className="px-4 py-3">
//                         <div className="flex items-center gap-2">
//                           <button
//                             className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
//                             aria-label={`Edit ${customer.name}`}
//                           >
//                             <Edit className="h-5 w-5" />
//                           </button>
//                           <button
//                             className="rounded-full p-1 text-red-500 hover:bg-gray-100"
//                             aria-label={`Delete ${customer.name}`}
//                           >
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
//               <button className="rounded-full bg-gray-200 px-6 py-2 text-sm font-medium hover:bg-gray-300">
//                 Page 01
//               </button>
//               <button className="rounded-full bg-gray-200 p-2 hover:bg-gray-300">
//                 <ChevronRight className="h-4 w-4" />
//               </button>
//             </div>
//           </div>

//           {/* Sidebar */}
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
