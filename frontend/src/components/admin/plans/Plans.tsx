"use client";
import { useState, useEffect } from "react";
import { Package, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePlans } from "../../../hooks/useAdminPlans";
import { useDeletePlan } from "../../../hooks/useDeletePlan";
import Swal from "sweetalert2";
import { useAppSelector } from "../../../redux/store";
import AdminSearchBar from "../Controls/AdminSearchBar";
import SortFilter from "../Controls/AdminSortFilter";
import AdminPagination from "../Controls/AdminPagination";
interface Plan {
  _id: string;
  name: string;
  type: "paid" | "free";
  regularAmount: number;
  discountAmount: number;
  benefits: string[];
  isListed: boolean;
}

export default function SubscriptionPlans() {
  const navigate = useNavigate();
  const { isAuthenticated, accessToken } = useAppSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('All');
  const [page, setPage] = useState(1);
  const limit = 4;
  const { data = { plans: [], total: 0 }, isLoading, isError } = usePlans(page, limit, searchTerm, sortOption);
  const totalPages = Math.ceil((data.total || 0) / limit);
  const { mutate } = useDeletePlan();
  const plansSortOption=[
    {value:'All',label:'All Plans'},{value:'A-Z',label:'A-Z'},{value:'Z-A',label:'Z-A'},{value:"saleLowHigh" ,label:"Sale Amount (Low-High)"},{value:"saleHighLow" ,label:'Sale Amount (High-Low)'}
  ]
  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      navigate('/adminLogin');
    }
  }, [isAuthenticated, accessToken, navigate]);

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
        mutate(id, {
          onSuccess: () => {
            Swal.fire("Deleted!", "Plan has been deleted.", "success");
          },
          onError: () => {
            Swal.fire("Error!", "Failed to delete plan.", "error");
          },
        });
      }
    });
  };

  if (isLoading) return <div className="text-center py-12">Loading plans...</div>;
  if (isError) return <div className="text-center py-12 text-red-500">Failed to load plans.</div>;
  if (!isAuthenticated) return <div className="text-center py-12">Redirecting to login...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8 flex-1">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <AdminSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <SortFilter sortOption={sortOption} setSortOption={setSortOption} options={plansSortOption}/>
          <button
            className="flex items-center bg-orange-500 text-white px-3 py-1.5 rounded-full font-medium text-sm shadow-sm hover:bg-orange-600 hover:-translate-y-[2px] transition-all duration-300"
            onClick={() => navigate('/plans/add')}
          >
            <Package className="h-4 w-4 mr-1" />
            <span>Add New Plan</span>
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-orange-50 text-gray-600 font-semibold">
                <th className="rounded-tl-lg px-4 py-3 text-left text-sm">S. Number</th>
                <th className="px-4 py-3 text-left text-sm">Name</th>
                <th className="px-4 py-3 text-left text-sm">Type</th>
                <th className="px-4 py-3 text-left text-sm">Amount</th>
                <th className="px-4 py-3 text-left text-sm">Sale Amount</th>
                <th className="px-4 py-3 text-left text-sm">Benefits</th>
                <th className="px-4 py-3 text-left text-sm">Active</th>
                <th className="rounded-tr-lg px-4 py-3 text-left text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.plans.length > 0 ? (
                data.plans.map((plan: Plan, index: number) => (
                  <tr
                    key={plan._id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50 hover:-translate-y-[2px] transition-all duration-200"
                  >
                    <td className="px-4 py-3 font-bold">{index + 1 + (page - 1) * limit}</td>
                    <td className="px-4 py-3">{plan.name}</td>
                    <td className="px-4 py-3">{plan.type}</td>
                    <td className="px-4 py-3">{plan.regularAmount}</td>
                    <td className="px-4 py-3">{plan.discountAmount}</td>
                    <td className="px-4 py-3">
                      <div className="h-24 overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb:hover]:bg-gray-600">
                        <ol className="list-decimal pl-5 text-sm">
                          {plan.benefits.map((benefit, idx) => (
                            <li key={idx} className="mb-1">{benefit}</li>
                          ))}
                        </ol>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        className={`w-[100px] h-8 rounded-lg text-white font-medium text-sm uppercase tracking-wide transition-all duration-300 shadow-sm ${
                          plan.isListed
                            ? "bg-green-500 hover:bg-green-600 hover:-translate-y-[1px]"
                            : "bg-red-500 hover:bg-red-600 hover:-translate-y-[1px]"
                        }`}
                      >
                        {plan.isListed ? "TRUE" : "FALSE"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          className="p-2 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-600 hover:text-white hover:scale-110 transition-all duration-300 shadow-sm"
                          onClick={() => navigate(`/plans/edit/${plan._id}`)}
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(plan._id)}
                          className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white hover:scale-110 transition-all duration-300 shadow-sm"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-500">
                    No plans found. Try adjusting your search or add a new plan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <AdminPagination page={page} setPage={setPage} totalPages={totalPages} />
      </div>
    </div>
  );
}