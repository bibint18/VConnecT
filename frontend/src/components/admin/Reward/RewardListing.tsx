"use client";
import { useState, useEffect, useCallback } from "react";
import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { fetchRewards, deleteReward } from "@/services/AdminRewardService";
import { useDebounce } from "@/hooks/useDebounce";
import AdminSearchBar from "../Controls/AdminSearchBar";
import AdminPagination from "../Controls/AdminPagination";

export interface IReward {
  _id: string;
  rewardId: string;
  title: string;
  description: string;
  type: "room_creation" | "bonus_points";
  value: number;
  requiredPoints?: number;
  requiredStreak?: number;
  isActive: boolean;
  isUnlocked?: boolean;
  isClaimed?: boolean;
}

const AdminRewardsList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const [page, setPage] = useState(1);
  const limit = 4;
  const [data, setData] = useState<{ rewards: IReward[]; total: number }>({
    rewards: [],
    total: 0,
  });
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  const loadRewards = useCallback(async () => {
    try {
      setIsPending(true);
      const fetchedData = await fetchRewards(page, limit, debouncedSearchTerm);
      setData(fetchedData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setIsError(true);
      } else {
        setIsError(true);
      }
    } finally {
      setIsPending(false);
    }
  }, [page, debouncedSearchTerm, limit]);

  useEffect(() => {
    loadRewards();
  }, [loadRewards]);

  const handleDelete = (rewardId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This reward will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteReward(rewardId);
          Swal.fire("Deleted!", "Reward has been deleted.", "success");
          loadRewards();
        } catch (error: unknown) {
          if (error instanceof Error) {
            Swal.fire(error.message);
          } else {
            Swal.fire("Error!", "Failed to delete reward.", "error");
          }
        }
      }
    });
  };

  if (isPending)
    return <div className="text-center py-12">Loading rewards...</div>;
  if (isError)
    return (
      <div className="text-center py-12 text-red-500">
        Failed to load rewards...
      </div>
    );

  const totalPages = Math.ceil(data.total / limit);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8 flex-1">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-8">
          <div>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <AdminSearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
              <button
                className="flex items-center bg-orange-500 text-white px-3 py-1.5 rounded-full font-medium text-sm shadow-sm hover:bg-orange-600 hover:-translate-y-[2px] transition-all duration-300"
                onClick={() => navigate("/admin/rewards/add")}
              >
                <span>Add New Reward</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-orange-50 text-gray-600 font-semibold">
                    <th className="rounded-tl-lg px-4 py-3 text-left text-sm">
                      S. No
                    </th>
                    <th className="px-4 py-3 text-left text-sm">Title</th>
                    <th className="px-4 py-3 text-left text-sm">Type</th>
                    <th className="px-4 py-3 text-left text-sm">Value</th>
                    <th className="px-4 py-3 text-left text-sm">Points</th>
                    <th className="px-4 py-3 text-left text-sm">Streak</th>
                    <th className="rounded-tr-lg px-4 py-3 text-left text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.rewards.length > 0 ? (
                    data.rewards.map((reward, index) => (
                      <tr
                        key={reward.rewardId}
                        className="border-b border-gray-100 last:border-0 hover:bg-gray-50 hover:-translate-y-[2px] transition-all duration-200"
                      >
                        <td className="px-4 py-3">
                          <span className="font-bold">
                            {(page - 1) * limit + index + 1}
                          </span>
                        </td>
                        <td className="px-4 py-3">{reward.title}</td>
                        <td className="px-4 py-3">{reward.type}</td>
                        <td className="px-4 py-3">{reward.value}</td>
                        <td className="px-4 py-3">
                          {reward.requiredPoints || "-"}
                        </td>
                        <td className="px-4 py-3">
                          {reward.requiredStreak || "-"}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-600 hover:text-white hover:scale-110 transition-all duration-300 shadow-sm"
                              onClick={() =>
                                navigate(
                                  `/admin/rewards/edit/${reward.rewardId}`
                                )
                              }
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white hover:scale-110 transition-all duration-300 shadow-sm"
                              onClick={() => handleDelete(reward.rewardId)}
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-4 text-gray-500"
                      >
                        No rewards found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <AdminPagination
              page={page}
              setPage={setPage}
              totalPages={totalPages}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRewardsList;
