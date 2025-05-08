import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlanService } from "@/services/PlanService";
import toast from "react-hot-toast";
import { useAppSelector } from "@/redux/store";
import { useNavigate } from "react-router-dom";
import "./ListPlans.css";
const PricingPlans = () => {
    const [plans, setPlans] = useState([]);
    const [userPlan, setUserPlan] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [userPlanLoading, setUserPlanLoading] = useState(true);
    const planService = new PlanService();
    const userId = useAppSelector((state) => state.user.userId);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const plansData = await planService.getPlans();
                setPlans(plansData);
                setLoading(false);
            }
            catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to fetch plans");
                setLoading(false);
            }
        };
        const fetchUserPlan = async () => {
            if (!userId) {
                setUserPlanLoading(false);
                return;
            }
            try {
                const fetchedUserPlan = await planService.getUserPlan();
                setUserPlan(fetchedUserPlan);
                setUserPlanLoading(false);
            }
            catch (error) {
                toast.error(error instanceof Error ? error.message : "Failed to fetch user plan");
                setUserPlanLoading(false);
            }
        };
        fetchPlans();
        fetchUserPlan();
    }, [userId]);
    const handleSelectPlan = async (planId) => {
        if (!userId) {
            toast.error("Please login to select a plan");
            navigate("/login");
            return;
        }
        setPaymentLoading(true);
        try {
            const plan = plans.find((p) => p._id === planId);
            if (!plan)
                throw new Error("Plan not found");
            const { approvalUrl } = await planService.createPayment(userId, planId, plan.discountAmount);
            window.location.href = approvalUrl;
        }
        catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to initiate payment");
        }
    };
    if (loading || userPlanLoading) {
        return (_jsx("div", { className: "flex justify-center items-center min-h-[calc(100vh-4rem)] bg-black text-white ml-20 md:ml-64 pt-16", children: "Loading..." }));
    }
    if (plans.length === 0) {
        return (_jsx("div", { className: "flex justify-center items-center min-h-[calc(100vh-4rem)] bg-black text-gray-400 ml-20 md:ml-64 pt-16", children: "No plans available" }));
    }
    return (_jsxs("div", { className: "min-h-[calc(100vh-4rem)] bg-black text-white px-4 sm:px-6 py-12 flex flex-col items-center   pt-16", children: [_jsx(motion.h1, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "text-3xl sm:text-4xl font-bold mb-12 text-center", children: "Your Current Plan" }), userPlan && (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "relative rounded-3xl overflow-hidden border border-gray-800 shadow-lg bg-gray-900 w-full max-w-2xl mb-12", children: _jsxs("div", { className: "relative p-6 sm:p-8 flex flex-col", children: [_jsxs("h2", { className: "text-xl sm:text-2xl font-bold text-gray-200 mb-2", children: ["Your Current Plan: ", userPlan.planName] }), _jsxs("p", { className: "text-sm text-gray-400 mb-4", children: ["Status: ", _jsx("span", { className: `capitalize ${userPlan.status === "active" ? "text-green-400" : "text-red-400"}`, children: userPlan.status })] }), _jsxs("div", { className: "my-4 sm:my-6", children: [_jsxs("p", { className: "text-sm text-gray-400", children: ["Purchased On: ", new Date(userPlan.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })] }), _jsxs("p", { className: "text-sm text-gray-400", children: ["Expires On: ", userPlan.endDate
                                            ? new Date(userPlan.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                                            : "N/A"] }), _jsxs("p", { className: "text-sm text-gray-400", children: ["Transaction ID: ", userPlan.transactionId || "N/A"] }), _jsxs("p", { className: "text-sm text-gray-400", children: ["Room Benefit: ", userPlan.roomBenefit, " rooms"] })] })] }) })), _jsx(motion.h1, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "text-3xl sm:text-4xl font-bold mb-12 text-center", children: "Choose Your New Plan" }), _jsx(AnimatePresence, { children: _jsx("div", { className: "w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 justify-center", children: plans.map((plan) => (_jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: `relative rounded-3xl overflow-hidden border border-gray-800 shadow-lg ${plan.isPopular
                            ? "bg-purple-600/50 backdrop-blur-sm popular-plan-glow"
                            : "bg-gray-900"} hover:scale-105 transition-transform duration-300`, children: _jsxs("div", { className: "relative p-6 sm:p-8 flex flex-col h-full", children: [_jsxs("div", { className: "mb-4", children: [_jsx("h2", { className: "text-xl sm:text-2xl font-bold text-gray-200", children: plan.name }), _jsx("p", { className: "text-sm text-gray-400", children: plan.description })] }), _jsxs("div", { className: "my-4 sm:my-6", children: [_jsxs("p", { className: "text-3xl sm:text-4xl font-bold text-gray-200", children: ["$", plan.discountAmount, _jsxs("span", { className: "text-xl sm:text-2xl", children: ["/", plan.duration] })] }), plan.regularAmount > plan.discountAmount && (_jsxs("p", { className: "text-sm text-gray-400 line-through", children: ["Regular: $", plan.regularAmount] }))] }), _jsx("div", { className: "mb-4", children: _jsx("button", { onClick: () => setSelectedPlan(plan._id), className: `w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPlan === plan._id
                                            ? "border-pink-400"
                                            : "border-gray-400"}`, children: selectedPlan === plan._id && (_jsx(motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, transition: { duration: 0.3 }, className: "w-3 h-3 rounded-full bg-pink-400" })) }) }), _jsx("button", { onClick: () => handleSelectPlan(plan._id), className: "w-full py-2 sm:py-3 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-semibold hover:brightness-110 transition-all duration-300 mb-6 sm:mb-8", children: paymentLoading ? "Processing..." : "Select Plan" }), _jsx("div", { className: "w-full h-px bg-gray-700 mb-4 sm:mb-6" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-gray-200 mb-3 sm:mb-4", children: "What you will get" }), _jsx("ul", { className: "space-y-2 sm:space-y-3", children: plan.benefits.map((benefit, index) => (_jsxs("li", { className: "flex items-start text-gray-300 text-sm sm:text-base", children: [_jsx("span", { className: "inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full border border-gray-400", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-3 w-3 text-gray-200", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { fillRule: "evenodd", d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z", clipRule: "evenodd" }) }) }), benefit] }, index))) })] })] }) }, plan._id))) }) })] }));
};
export default PricingPlans;
