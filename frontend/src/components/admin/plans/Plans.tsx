

import { useState } from "react";
import { Search, Package, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import './plans.css';
import { usePlans } from "../../../hooks/useAdminPlans";
import { useDeletePlan } from "../../../hooks/useDeletePlan";
import Swal from "sweetalert2";
import {ChevronDown,BarChart2,ChevronRight,ChevronLeft} from 'lucide-react'
import { useAppSelector } from "../../../redux/store";
interface Plan {
  _id: string;
  serialNumber: string;
  name: string;
  regularAmount: string;
  discountAmount:string;
  sales:string
  benefits: string[];
  permission: string[];
  isListed:boolean;
  isDeleted:boolean
}

export default function SubscriptionPlans() {
  const navigate = useNavigate();
  const {isAuthenticated,accessToken} = useAppSelector((state) => state.user)
  console.log("Admin state redux ",isAuthenticated,accessToken)
  const [searchTerm,setSearchTerm] = useState('')
  const [sortOption,setSortOption] = useState('A-Z')
  const [page,setPage] = useState(1)
  const limit =4
  const {data={ plans: [], total: 0 },isPending,isError} = usePlans(page,limit,searchTerm,sortOption)
  console.log(data)
  const totalPages=Math.ceil(data.total/limit)
  const {mutate} = useDeletePlan() 
  console.log("plans: ",data.plans)
  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This plan will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        mutate(id);
        Swal.fire("Deleted!", "Plan has been deleted.", "success");
      }
    });
  };
  
  if (isPending) return <div className="text-center py-12">Loading plans...</div>;
  if (isError) return <div className="text-center py-12 text-red-500">Failed to load plans.</div>;
  return (
    <div className="subscription-plans flex-1">
      {/* <div className="container"> */}
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
    <option className="text-black " value="saleLowHigh">Sale Amount (Low-High)</option>
    <option className="text-black " value="saleHighLow">Sale Amount (High-Low)</option>
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
              {data.plans.map((plan:Plan,index:number) => (
                <tr key={plan._id} className="table-row border-b border-gray-100 last:border-0">
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
                        onClick={() => navigate(`/plans/edit/${plan._id}`)}
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleDelete(plan._id)}
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
        {data.plans.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No plans found. Try adjusting your search or add a new plan.</p>
          </div>
        )}
      {/* </div> */}

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
  );
}