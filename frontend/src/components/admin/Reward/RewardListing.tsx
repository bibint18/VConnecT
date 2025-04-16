import { useState, useEffect } from "react";
import { Search, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ChevronRight, ChevronLeft } from "lucide-react";
import axiosInstance from "@/utils/axiosInterceptor";
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
  const [page, setPage] = useState(1);
  const limit = 4;
  const [data, setData] = useState<{ rewards: IReward[]; total: number }>({ rewards: [], total: 0 });
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchRewards = async () => {
    try {
      setIsPending(true);
      const response = await axiosInstance.get(`/admin/rewards?page=${page}&limit=${limit}&search=${searchTerm}`);
      setData(response.data.data);
    } catch (error:unknown) {
      if (error instanceof Error) {
        setIsError(true);
        console.log('Caught error:', error.message);
      } else {
        setIsError(true);
        console.log('Unknown error:', error);
      }
      setIsError(true);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, [page, searchTerm]);

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
          await axiosInstance.delete(`/admin/rewards/${rewardId}`);
          Swal.fire("Deleted!", "Reward has been deleted.", "success");
          fetchRewards();
        } catch (error:unknown) {
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
    <div className="container mx-auto p-6">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="relative w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Search rewards..."
            className="w-full p-2 border rounded-lg !text-black"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 !text-orange-500" />
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={() => navigate("/admin/rewards/add")}
        >
          Add New Reward
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3 text-left">S. No</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Value</th>
              <th className="px-4 py-3 text-left">Points</th>
              <th className="px-4 py-3 text-left">Streak</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.rewards.map((reward, index) => (
              <tr key={reward.rewardId} className="border-b">
                <td className="px-4 py-3">{(page - 1) * limit + index + 1}</td>
                <td className="px-4 py-3">{reward.title}</td>
                <td className="px-4 py-3">{reward.type}</td>
                <td className="px-4 py-3">{reward.value}</td>
                <td className="px-4 py-3">{reward.requiredPoints || "-"}</td>
                <td className="px-4 py-3">{reward.requiredStreak || "-"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => navigate(`/admin/rewards/edit/${reward.rewardId}`)}
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(reward.rewardId)}
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

      {data.rewards.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No rewards found. Try adjusting your search or add a new reward.</p>
        </div>
      )}

      <div className="flex justify-center mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
          className="px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="px-3 py-1 mx-1">{page}</span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => prev + 1)}
          className="px-3 py-1 mx-1 bg-gray-200 rounded disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default AdminRewardsList;