import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { fetchReward, saveReward } from "@/services/AdminRewardService";
const AddReward = () => {
    const { rewardId } = useParams();
    console.log('rewardId', rewardId);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: "",
        description: "",
        type: "room_creation",
        value: 0,
        requiredPoints: "",
        requiredStreak: "",
        isActive: true,
    });
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (rewardId) {
            console.log('rewardId', rewardId);
            const fetchData = async () => {
                try {
                    const reward = await fetchReward(rewardId);
                    console.log("reward", reward);
                    setForm({
                        title: reward.title,
                        description: reward.description,
                        type: reward.type,
                        value: reward.value,
                        requiredPoints: reward.requiredPoints || "",
                        requiredStreak: reward.requiredStreak || "",
                        isActive: reward.isActive,
                    });
                }
                catch (error) {
                    if (error instanceof Error) {
                        toast(error.message);
                        console.log("Caught error:", error.message);
                    }
                    else {
                        toast("Error! failed to load rewards");
                        console.log("Unknown error:", error);
                    }
                }
            };
            fetchData();
        }
    }, [rewardId]);
    const validate = () => {
        const errors = {};
        if (!form.title.trim())
            errors.title = "Title is required";
        if (!form.description.trim()) {
            errors.description = "Description is required";
        }
        else if (form.description.trim().length < 10) {
            errors.description = "Description must be at least 10 characters";
        }
        if (form.value <= 0)
            errors.value = "Value must be greater than 0";
        if (!form.requiredPoints && !form.requiredStreak) {
            errors.requiredPoints = "Either required points or streak is needed";
            errors.requiredStreak = "Either required points or streak is needed";
        }
        return errors;
    };
    const handleSubmit = async (e) => {
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
        }
        catch (error) {
            if (error instanceof Error) {
                toast(error.message);
                console.log("Caught error:", error.message);
            }
            else {
                toast("Failed to save reward");
                console.log("Unknown error:", error);
            }
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "container !bg-white mx-auto p-6", children: _jsxs("form", { onSubmit: handleSubmit, className: "max-w-lg bg-white p-6 rounded-lg shadow-lg !text-black", children: [_jsx("h1", { className: "text-3xl font-bold mb-6", children: rewardId ? "Edit Reward" : "Add New Reward" }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Title" }), _jsx("input", { type: "text", value: form.title, onChange: (e) => setForm({ ...form, title: e.target.value }), className: "w-full p-2 border rounded-lg !text-black" }), formErrors.title && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: formErrors.title }))] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Description" }), _jsx("textarea", { value: form.description, onChange: (e) => setForm({ ...form, description: e.target.value }), className: "w-full p-2 border rounded-lg !text-black" }), formErrors.description && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: formErrors.description }))] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Type" }), _jsxs("select", { value: form.type, onChange: (e) => setForm({
                                ...form,
                                type: e.target.value,
                            }), className: "w-full p-2 border rounded-lg", children: [_jsx("option", { value: "room_creation", children: "Room Creation" }), _jsx("option", { value: "bonus_points", children: "Bonus Points" })] })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Value" }), _jsx("input", { type: "number", value: form.value, onChange: (e) => setForm({ ...form, value: Number(e.target.value) }), className: "w-full p-2 border rounded-lg !text-black", min: 1 }), formErrors.value && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: formErrors.value }))] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Required Points (optional)" }), _jsx("input", { type: "number", value: form.requiredPoints, onChange: (e) => setForm({ ...form, requiredPoints: e.target.value }), className: "w-full p-2 border rounded-lg !text-black", min: "0" }), formErrors.requiredPoints && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: formErrors.requiredPoints }))] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Required Streak (optional)" }), _jsx("input", { type: "number", value: form.requiredStreak, onChange: (e) => setForm({ ...form, requiredStreak: e.target.value }), className: "w-full p-2 border rounded-lg !text-black", min: "0" }), formErrors.requiredStreak && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: formErrors.requiredStreak }))] }), _jsx("div", { className: "mb-4", children: _jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "checkbox", checked: form.isActive, onChange: (e) => setForm({ ...form, isActive: e.target.checked }), className: "mr-2" }), "Active"] }) }), _jsx("button", { type: "submit", disabled: loading, className: "w-full bg-blue-600 !text-black py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50", children: loading
                        ? "Saving..."
                        : rewardId
                            ? "Update Reward"
                            : "Create Reward" })] }) }));
};
export default AddReward;
