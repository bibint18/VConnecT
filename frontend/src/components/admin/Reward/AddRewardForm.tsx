import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchReward, saveReward } from "@/services/AdminRewardService";

const AddReward: React.FC = () => {
  const { rewardId } = useParams();
  console.log('rewardId',rewardId)
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "room_creation" as "room_creation" | "bonus_points",
    value: 0,
    requiredPoints: "",
    requiredStreak: "",
    isActive: true,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (rewardId) {
      console.log('rewardId',rewardId)
      const fetchData = async () => {

        try {
          const reward = await fetchReward(rewardId);
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
      fetchData();
    }
  }, [rewardId]);
  const validate = () => {
    const errors: Record<string, string> = {};
    if (!form.title.trim()) errors.title = "Title is required";
    if (!form.description.trim()) {
      errors.description = "Description is required";
    } else if (form.description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters";
    }
    if (form.value <= 0) errors.value = "Value must be greater than 0";

    if (!form.requiredPoints && !form.requiredStreak) {
      errors.requiredPoints = "Either required points or streak is needed";
      errors.requiredStreak = "Either required points or streak is needed";
    }

    return errors;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
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
      await saveReward(rewardId, payload);
      toast.success(rewardId ? "Reward updated!" : "Reward created!");
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
        className="max-w-lg bg-white p-6 rounded-lg shadow-lg !text-black"
      >
        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full p-2 border rounded-lg !text-black"
          />
          {formErrors.title && (
            <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full p-2 border rounded-lg !text-black"
          ></textarea>
          {formErrors.description && (
            <p className="text-red-500 text-sm mt-1">
              {formErrors.description}
            </p>
          )}
        </div>

        {/* Type */}
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

        {/* Value */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Value</label>
          <input
            type="number"
            value={form.value}
            onChange={(e) =>
              setForm({ ...form, value: Number(e.target.value) })
            }
            className="w-full p-2 border rounded-lg !text-black"
            min={1}
          />
          {formErrors.value && (
            <p className="text-red-500 text-sm mt-1">{formErrors.value}</p>
          )}
        </div>

        {/* Required Points */}
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
          {formErrors.requiredPoints && (
            <p className="text-red-500 text-sm mt-1">
              {formErrors.requiredPoints}
            </p>
          )}
        </div>

        {/* Required Streak */}
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
          {formErrors.requiredStreak && (
            <p className="text-red-500 text-sm mt-1">
              {formErrors.requiredStreak}
            </p>
          )}
        </div>

        {/* Active Checkbox */}
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm({ ...form, isActive: e.target.checked })
              }
              className="mr-2"
            />
            Active
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 !text-black py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : rewardId
            ? "Update Reward"
            : "Create Reward"}
        </button>
      </form>
    </div>
  );
};

export default AddReward;
