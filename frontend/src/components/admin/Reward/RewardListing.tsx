import { useState, useEffect } from "react";
import { Search, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { fetchRewards,deleteReward } from "@/services/AdminRewardService";
import { useDebounce } from "@/hooks/useDebounce";
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
  const debouncedSearchTerm = useDebounce(searchTerm,1000);
  const [page, setPage] = useState(1);
  const limit = 4;
  const [data, setData] = useState<{ rewards: IReward[]; total: number }>({ rewards: [], total: 0 });
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  const loadRewards = async () => {
    try {
      setIsPending(true);
      const fetchedData = await fetchRewards(page, limit, debouncedSearchTerm);
      setData(fetchedData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setIsError(true);
        console.log('Caught error:', error.message);
      } else {
        setIsError(true);
        console.log('Unknown error:', error);
      }
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    loadRewards();
  }, [page, debouncedSearchTerm]);

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
          await deleteReward(rewardId); // Use deleteReward service
          Swal.fire("Deleted!", "Reward has been deleted.", "success");
          loadRewards(); // Reload rewards after deletion
        } catch (error: unknown) {
          if (error instanceof Error) {
            Swal.fire(error.message);
            console.log('Caught error:', error.message);
          } else {
            Swal.fire("Error!", "Failed to delete reward.", "error");
            console.log('Unknown error:', error);
          }
        }
      }
    });
  };

  if (isPending) return <div className="text-center py-12">Loading rewards...</div>;
  if (isError) return <div className="text-center py-12 text-red-500">Failed to load rewards.</div>;

  const totalPages = Math.ceil(data.total / limit);

  return (
    <div className="customer-dashboard flex-1">
      <div className="container">
        <div className="grid-layout">
          <div>
            <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search rewards..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-orange-500" />
              </div>
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                onClick={() => navigate("/admin/rewards/add")}
              >
                Add New Reward
              </button>
            </div>

            <div className="table-container !text-dark">
              <table className="w-full !text-black">
                <thead>
                  <tr className="table-header">
                    <th className="rounded-tl-lg px-4 py-3 text-left text-sm">S. No</th>
                    <th className="px-4 py-3 text-left text-sm">Title</th>
                    <th className="px-4 py-3 text-left text-sm">Type</th>
                    <th className="px-4 py-3 text-left text-sm">Value</th>
                    <th className="px-4 py-3 text-left text-sm">Points</th>
                    <th className="px-4 py-3 text-left text-sm">Streak</th>
                    <th className="rounded-tr-lg px-4 py-3 text-left text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rewards.length > 0 ? (
                    data.rewards.map((reward, index) => (
                      <tr key={reward.rewardId} className="table-row border-b border-gray-100 last:border-0">
                        <td className="px-4 py-3">
                          <span className="font-bold">{(page - 1) * limit + index + 1}</span>
                        </td>
                        <td className="px-4 py-3">{reward.title}</td>
                        <td className="px-4 py-3">{reward.type}</td>
                        <td className="px-4 py-3">{reward.value}</td>
                        <td className="px-4 py-3">{reward.requiredPoints || "-"}</td>
                        <td className="px-4 py-3">{reward.requiredStreak || "-"}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              className="action-button edit-button"
                              onClick={() => navigate(`/admin/rewards/edit/${reward.rewardId}`)}
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              className="action-button delete-button"
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
                      <td colSpan={7} className="text-center py-4 text-gray-500">
                        No rewards found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="page-button"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-3 py-2">{page}</span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="page-button"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRewardsList;