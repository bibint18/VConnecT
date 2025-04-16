import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "@/utils/axiosInterceptor";
import toast from "react-hot-toast";

const AddReward: React.FC = () => {
  const { rewardId } = useParams();
  console.log('rewardId',rewardId)
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "room_creation" as "room_creation" | "bonus_points",
    value: '',
    requiredPoints: "",
    requiredStreak: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (rewardId) {
      console.log('rewardId',rewardId)
      const fetchReward = async () => {
        try {
          const response = await axiosInstance.get(
            `/admin/reward?rewardId=${rewardId}`
          );
          console.log("response after fetch",response.data.data)
          const reward = response.data.data;
          console.log("reward",reward)
          setForm({
            title: reward.title,
            description: reward.description,
            type: reward.type,
            value: reward.value,
            requiredPoints: reward.requiredPoints || "",
            requiredStreak: reward.requiredStreak || "",
            isActive: reward.isActive,
          });
        } catch (error) {
          if (error instanceof Error) {
            toast(error.message);
            console.log("Caught error:", error.message);
          } else {
            toast("Error! failed to load rewards");
            console.log("Unknown error:", error);
          }
        }
      };
      fetchReward();
    }
  }, [rewardId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...form,
        requiredPoints: form.requiredPoints
          ? Number(form.requiredPoints)
          : undefined,
        requiredStreak: form.requiredStreak
          ? Number(form.requiredStreak)
          : undefined,
      };
      if (rewardId) {
        await axiosInstance.put(`/admin/rewards/${rewardId}`, payload);
        toast.success("Reward updated!");
      } else {
        await axiosInstance.post("/admin/rewards", payload);
        toast.success("Reward created!");
      }
      navigate("/admin/rewards");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast(error.message);
        console.log("Caught error:", error.message);
      } else {
        toast("Failed to save reward");
        console.log("Unknown error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        {rewardId ? "Edit Reward" : "Add New Reward"}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-lg bg-white p-6 rounded-lg shadow-lg"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full p-2 border rounded-lg !text-black"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full p-2 border rounded-lg !text-black"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value as "room_creation" | "bonus_points",
              })
            }
            className="w-full p-2 border rounded-lg"
          >
            <option value="room_creation">Room Creation</option>
            <option value="bonus_points">Bonus Points</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Value</label>
          <input
            type="number"
            value={form.value}
            onChange={(e) =>
              setForm({ ...form, value: Number(e.target.value) })
            }
            className="w-full p-2 border rounded-lg !text-black"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Required Points (optional)
          </label>
          <input
            type="number"
            value={form.requiredPoints}
            onChange={(e) =>
              setForm({ ...form, requiredPoints: e.target.value })
            }
            className="w-full p-2 border rounded-lg !text-black"
            min="0"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Required Streak (optional)
          </label>
          <input
            type="number"
            value={form.requiredStreak}
            onChange={(e) =>
              setForm({ ...form, requiredStreak: e.target.value })
            }
            className="w-full p-2 border rounded-lg !text-black"
            min="0"
          />
        </div>
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="mr-2"
            />
            Active
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 !text-black py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : rewardId ? "Update Reward" : "Create Reward"}
        </button>
      </form>
    </div>
  );
};

export default AddReward;
