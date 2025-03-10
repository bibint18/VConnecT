// "use client"

// import { useState } from "react"
// import { Search, Package, Pencil, Trash2, Plus } from "lucide-react"

// // Updated Plan type with arrays for benefits and permissions
// interface Plan {
//   id: string
//   serialNumber: string
//   name: string
//   amount: string
//   benefits: string[]
//   permission: string[]
//   status: "ACTIVE" | "INACTIVE"
// }

// export default function SubscriptionPlans() {
//   // Sample data that can be replaced with actual data from an API
//   const [plans, setPlans] = useState<Plan[]>([
//     {
//       id: "1",
//       serialNumber: "01",
//       name: "Basic",
//       amount: "Free",
//       benefits: ["1 Room Creation", "Basic Support", "Standard Templates"],
//       permission: ["Friend requests", "Public Profile", "Basic Messaging"],
//       status: "ACTIVE",
//     },
//     {
//       id: "2",
//       serialNumber: "01",
//       name: "Premium",
//       amount: "10$",
//       benefits: ["Room Creation", "Priority Support", "Premium Templates", "Custom Themes"],
//       permission: ["Premium Rooms", "Advanced Messaging", "File Sharing", "Group Creation"],
//       status: "ACTIVE",
//     },
//     {
//       id: "3",
//       serialNumber: "01",
//       name: "Platinum",
//       amount: "50$",
//       benefits: [
//         "Room Creation",
//         "24/7 Support",
//         "All Templates",
//         "Custom Branding",
//         "Analytics Dashboard",
//         "Priority Rendering",
//       ],
//       permission: ["Unlimited access", "Admin Controls", "API Access", "White Labeling", "Custom Integrations"],
//       status: "ACTIVE",
//     },
//   ])

//   // State for adding new benefits/permissions
//   const [addingBenefitTo, setAddingBenefitTo] = useState<string | null>(null)
//   const [addingPermissionTo, setAddingPermissionTo] = useState<string | null>(null)
//   const [newBenefit, setNewBenefit] = useState("")
//   const [newPermission, setNewPermission] = useState("")

//   const [searchTerm, setSearchTerm] = useState("")

//   // Filter plans based on search term
//   const filteredPlans = plans.filter(
//     (plan) =>
//       plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       plan.amount.toLowerCase().includes(searchTerm.toLowerCase()),
//   )

//   // Toggle plan status
//   const toggleStatus = (id: string) => {
//     setPlans(
//       plans.map((plan) =>
//         plan.id === id ? { ...plan, status: plan.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" } : plan,
//       ),
//     )
//   }

//   // Delete plan
//   const deletePlan = (id: string) => {
//     setPlans(plans.filter((plan) => plan.id !== id))
//   }

//   // Add new benefit to a plan
//   const addBenefit = (planId: string) => {
//     if (!newBenefit.trim()) return

//     setPlans((prevPlans) =>
//       prevPlans.map((plan) => (plan.id === planId ? { ...plan, benefits: [...plan.benefits, newBenefit] } : plan)),
//     )

//     setNewBenefit("")
//     setAddingBenefitTo(null)
//   }

//   // Add new permission to a plan
//   const addPermission = (planId: string) => {
//     if (!newPermission.trim()) return

//     setPlans((prevPlans) =>
//       prevPlans.map((plan) =>
//         plan.id === planId ? { ...plan, permission: [...plan.permission, newPermission] } : plan,
//       ),
//     )

//     setNewPermission("")
//     setAddingPermissionTo(null)
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-sm">
//       <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
//         {/* Search Bar */}
//         <div className="relative w-full md:w-96">
//           <input
//             type="text"
//             placeholder="Search Plans here"
//             className="w-full pl-4 pr-10 py-2 bg-gray-50 rounded-full border-none focus:ring-2 focus:ring-blue-100 focus:outline-none"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <Search className="absolute right-3 top-2.5 text-orange-400 h-5 w-5" />
//         </div>

//         {/* Add Plan Button */}
//         <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-full transition-colors">
//           <Package className="h-5 w-5" />
//           <span>Add Plan</span>
//         </button>
//       </div>

//       {/* Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse">
//           {/* Table Header */}
//           <thead>
//             <tr className="bg-orange-50 rounded-lg">
//               <th className="py-4 px-4 text-left text-gray-600 font-medium rounded-l-lg">S. Number</th>
//               <th className="py-4 px-4 text-left text-gray-600 font-medium">Name</th>
//               <th className="py-4 px-4 text-left text-gray-600 font-medium">Amount</th>
//               <th className="py-4 px-4 text-left text-gray-600 font-medium">Benefits</th>
//               <th className="py-4 px-4 text-left text-gray-600 font-medium">Permission</th>
//               <th className="py-4 px-4 text-left text-gray-600 font-medium">Status</th>
//               <th className="py-4 px-4 text-left text-gray-600 font-medium">Change Status</th>
//               <th className="py-4 px-4 text-left text-gray-600 font-medium rounded-r-lg">Update</th>
//             </tr>
//           </thead>

//           {/* Table Body */}
//           <tbody>
//             {filteredPlans.map((plan) => (
//               <tr key={plan.id} className="border-b border-gray-100 hover:bg-gray-50">
//                 <td className="py-4 px-4 text-gray-800 font-medium">{plan.serialNumber}</td>
//                 <td className="py-4 px-4 text-gray-800 font-medium">{plan.name}</td>
//                 <td className="py-4 px-4 text-gray-800">{plan.amount}</td>

//                 {/* Benefits Column with Scrollable List */}
//                 <td className="py-4 px-4 text-gray-800">
//                   <div className="flex flex-col">
//                     <div className="h-24 overflow-y-auto pr-2 mb-2">
//                       <ol className="list-decimal pl-5">
//                         {plan.benefits.map((benefit, index) => (
//                           <li key={index} className="mb-1">
//                             {benefit}
//                           </li>
//                         ))}
//                       </ol>
//                     </div>

//                     {addingBenefitTo === plan.id ? (
//                       <div className="flex mt-2">
//                         <input
//                           type="text"
//                           value={newBenefit}
//                           onChange={(e) => setNewBenefit(e.target.value)}
//                           className="flex-1 px-2 py-1 text-sm border rounded-l-md focus:outline-none focus:ring-1 focus:ring-teal-500"
//                           placeholder="New benefit"
//                         />
//                         <button
//                           onClick={() => addBenefit(plan.id)}
//                           className="bg-teal-600 text-white px-2 py-1 rounded-r-md text-sm"
//                         >
//                           Add
//                         </button>
//                       </div>
//                     ) : (
//                       <button
//                         onClick={() => setAddingBenefitTo(plan.id)}
//                         className="flex items-center gap-1 text-teal-600 hover:text-teal-800 text-sm mt-1"
//                       >
//                         <Plus className="h-3 w-3" />
//                         <span>Add Benefit</span>
//                       </button>
//                     )}
//                   </div>
//                 </td>
//               {/* Permission Column with Scrollable List */}
//                 <td className="py-4 px-4 text-gray-800">
//                   <div className="flex flex-col">
//                     <div className="h-24 overflow-y-auto pr-2 mb-2">
//                       <ol className="list-decimal pl-5">
//                         {plan.permission.map((perm, index) => (
//                           <li key={index} className="mb-1">
//                             {perm}
//                           </li>
//                         ))}
//                       </ol>
//                     </div>

//                     {addingPermissionTo === plan.id ? (
//                       <div className="flex mt-2">
//                         <input
//                           type="text"
//                           value={newPermission}
//                           onChange={(e) => setNewPermission(e.target.value)}
//                           className="flex-1 px-2 py-1 text-sm border rounded-l-md focus:outline-none focus:ring-1 focus:ring-teal-500"
//                           placeholder="New permission"
//                         />
//                         <button
//                           onClick={() => addPermission(plan.id)}
//                           className="bg-teal-600 text-white px-2 py-1 rounded-r-md text-sm"
//                         >
//                           Add
//                         </button>
//                       </div>
//                     ) : (
//                       <button
//                         onClick={() => setAddingPermissionTo(plan.id)}
//                         className="flex items-center gap-1 text-teal-600 hover:text-teal-800 text-sm mt-1"
//                       >
//                         <Plus className="h-3 w-3" />
//                         <span>Add Permission</span>
//                       </button>
//                     )}
//                   </div>
//                 </td>

//                 <td className="py-4 px-4 text-gray-800 font-medium">{plan.status}</td>
//                 <td className="py-4 px-4">
//                   <div
//                     className={`relative inline-block w-12 h-6 rounded-full transition-colors cursor-pointer ${plan.status === "ACTIVE" ? "bg-gray-800" : "bg-gray-300"}`}
//                     onClick={() => toggleStatus(plan.id)}
//                   >
//                     <div
//                       className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${plan.status === "ACTIVE" ? "translate-x-6" : ""}`}
//                     >
//                       {plan.status === "ACTIVE" && (
//                         <div className="absolute inset-0 flex items-center justify-center">
//                           <div className="w-2 h-2 bg-green-500 rounded-full"></div>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </td>
//                 <td className="py-4 px-4">
//                   <div className="flex items-center gap-3">
//                     <button className="text-gray-500 hover:text-blue-500 transition-colors">
//                       <Pencil className="h-5 w-5" />
//                     </button>
//                     <button
//                       className="text-gray-500 hover:text-red-500 transition-colors"
//                       onClick={() => deletePlan(plan.id)}
//                     >
//                       <Trash2 className="h-5 w-5" />
//                     </button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Empty state */}
//       {filteredPlans.length === 0 && (
//         <div className="text-center py-8">
//           <p className="text-gray-500">No plans found. Try a different search or add a new plan.</p>
//         </div>
//       )}
//     </div>
//   )
// }

// /* subscriptionPlans.css */





import { useState } from "react";
import { Search, Package, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import './plans.css';
import { usePlans } from "../../../hooks/useAdminPlans";

interface Plan {
  id: string;
  serialNumber: string;
  name: string;
  regularAmount: string;
  discountAmount:string;
  sales:string
  benefits: string[];
  permission: string[];
  isListed:boolean
}

export default function SubscriptionPlans() {
  const navigate = useNavigate();
  const [searchTerm,setSearchTerm] = useState('')
  const {data:plans=[],isPending,isError} = usePlans()
  console.log("plans: ",plans)
  // const [plans, setPlans] = useState<Plan[]>([
  //   {
  //     id: "1",
  //     serialNumber: "01",
  //     name: "Basic",
  //     amount: "Free",
  //     benefits: ["1 Room Creation", "Basic Support", "Standard Templates"],
  //     permission: ["Friend requests", "Public Profile", "Basic Messaging"],
  //     status: "ACTIVE",
  //   },
  //   {
  //     id: "2",
  //     serialNumber: "02",
  //     name: "Premium",
  //     amount: "$10/mo",
  //     benefits: ["Room Creation", "Priority Support", "Premium Templates", "Custom Themes"],
  //     permission: ["Premium Rooms", "Advanced Messaging", "File Sharing", "Group Creation"],
  //     status: "ACTIVE",
  //   },
  //   {
  //     id: "3",
  //     serialNumber: "03",
  //     name: "Platinum",
  //     amount: "$50/mo",
  //     benefits: [
  //       "Room Creation",
  //       "24/7 Support",
  //       "All Templates",
  //       "Custom Branding",
  //       "Analytics Dashboard",
  //       "Priority Rendering",
  //     ],
  //     permission: ["Unlimited access", "Admin Controls", "API Access", "White Labeling", "Custom Integrations"],
  //     status: "ACTIVE",
  //   },
  // ]);

  const filteredPlans = (plans as Plan[]).filter(
    (plan:Plan) =>
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.regularAmount.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // const toggleStatus = (id: string) => {
  //   setPlans(
  //     plans.map((plan) =>
  //       plan.id === id ? { ...plan, status: plan.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" } : plan,
  //     ),
  //   );
  // };

  // const deletePlan = (id: string) => {
  //   setPlans(plans.filter((plan) => plan.id !== id));
  // };
  if (isPending) return <div className="text-center py-12">Loading plans...</div>;
  if (isError) return <div className="text-center py-12 text-red-500">Failed to load plans.</div>;
  return (
    <div className="subscription-plans flex-1">
      <div className="container">
        <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          {/* Search Bar */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search plans here"
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-500" />
          </div>

          {/* Add Plan Button */}
          <button 
            className="add-plan-button" 
            onClick={() => navigate('/plans/add')}
          >
            <Package className="h-4 w-4 mr-1" />
            <span>Add New Plan</span>
          </button>
        </div>

        {/* Table */}
        <div className="table-container">
          <table className="w-full">
            <thead>
              <tr className="table-header">
                <th className="rounded-tl-lg px-4 py-3 text-left text-sm">S. Number</th>
                <th className="px-4 py-3 text-left text-sm">Name</th>
                <th className="px-4 py-3 text-left text-sm">Amount</th>
                <th className="px-4 py-3 text-left text-sm">Sale Amount</th>
                <th className="px-4 py-3 text-left text-sm">Benefits</th>
                <th className="px-4 py-3 text-left text-sm">ACTIVE</th>
                <th className="rounded-tr-lg px-4 py-3 text-left text-sm">Update</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlans.map((plan:Plan,index:number) => (
                <tr key={plan.id} className="table-row border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3 font-bold">{index+1}</td>
                  <td className="px-4 py-3">{plan.name}</td>
                  <td className="px-4 py-3">{plan.regularAmount
                  }</td>
                  <td className="px-4 py-3">{plan.discountAmount}</td>
                  <td className="px-4 py-3">
                    <div className="h-24 overflow-y-auto pr-2 custom-scrollbar">
                      <ol className="list-decimal pl-5 text-sm">
                        {plan.benefits.map((benefit, index) => (
                          <li key={index} className="mb-1">
                            {benefit}
                          </li>
                        ))}
                      </ol>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className={`status-button ${plan.isListed  ? "status-active"  : "status-inactive"}`}
                    >
                      {plan.isListed ? "TRUE" : "FALSE"}
                    </button>
                    

                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button 
                        className="action-button edit-button" 
                        onClick={() => navigate(`/plans/edit/${plan.id}`)}
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        className="action-button delete-button"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredPlans.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No plans found. Try adjusting your search or add a new plan.</p>
          </div>
        )}
      </div>
    </div>
  );
}