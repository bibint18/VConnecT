import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from "react";
import { RewardService } from "@/services/RewardService";
import { useAppSelector } from "@/redux/store";
import toast from "react-hot-toast";
import { Lock, Unlock, CheckCircle, Star, Sparkle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import './RewardList.css';
const RewardsList = () => {
    const { userId } = useAppSelector((state) => state.user);
    const [rewards, setRewards] = useState([]);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const rewardService = new RewardService();
    useEffect(() => {
        if (!userId) {
            toast.error("Please log in to view rewards");
            setLoading(false);
            return;
        }
        const fetchData = async () => {
            try {
                setLoading(true);
                const [userData, rewardsData] = await Promise.all([
                    rewardService.getUserDetails(userId),
                    rewardService.getRewards(),
                ]);
                setUserData(userData);
                setRewards(rewardsData);
            }
            catch (err) {
                toast.error(err instanceof Error ? err.message : "Failed to load data");
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);
    const handleClaim = useCallback(async (rewardId) => {
        try {
            await rewardService.claimReward(rewardId);
            setRewards((prev) => prev.map((r) => (r.rewardId === rewardId ? { ...r, isClaimed: true } : r)));
            if (userId) {
                const updatedUser = await rewardService.getUserDetails(userId);
                setUserData(updatedUser);
            }
            toast.success("Reward claimed!");
        }
        catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to claim reward");
        }
    }, [userId]);
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-[calc(100vh-4rem)] text-white", children: "Loading rewards..." }));
    }
    if (!userData || userData.point === undefined || userData.streak === undefined) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-[calc(100vh-4rem)] text-red-500", children: "Failed to load user data" }));
    }
    const { point, streak } = userData;
    return (_jsxs("div", { className: "min-h-[calc(100vh-4rem)] bg-black text-white px-4 sm:px-6 py-6", children: [_jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.5 }, className: "relative bg-black/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-8 border border-pink-500/20 shadow-lg shadow-pink-500/10 overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 gradient-float" }), _jsxs("div", { className: "relative flex flex-col items-center space-y-4 text-center", children: [_jsxs("p", { className: "text-gray-200 text-sm sm:text-base font-semibold", children: [_jsx(motion.span, { className: "inline-block", animate: { scale: [1, 1.2, 1] }, transition: { repeat: Infinity, duration: 2 }, children: _jsx(Star, { className: "inline w-4 h-4 mr-1 text-yellow-400" }) }), "Check in daily to earn rewards and boost your streak!"] }), _jsx("p", { className: "text-gray-400 text-xs sm:text-sm", children: "Unlock exclusive rewards with your streak and points." }), _jsxs("div", { className: "flex items-center justify-center space-x-4", children: [_jsxs("p", { className: "text-gray-200 font-medium", children: ["Streak: ", streak, " ", _jsx(Sparkle, { className: "inline w-4 h-4 text-purple-400" })] }), _jsxs("p", { className: "text-gray-200 font-medium", children: ["Points: ", point, " ", _jsx(Sparkle, { className: "inline w-4 h-4 text-pink-400" })] })] }), _jsx("div", { className: "w-16 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mt-2" })] })] }), _jsx(motion.h1, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: "text-3xl font-bold mb-6 text-center", children: "Your Rewards" }), _jsx(AnimatePresence, { children: rewards.length === 0 ? (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "text-center text-gray-400 py-12", children: "No rewards available" })) : (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: rewards.map((reward) => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 }, className: `relative bg-gray-900 rounded-xl p-6 shadow-lg hover:scale-105 transition-transform duration-300 border ${reward.isClaimed
                            ? "border-green-500"
                            : reward.isUnlocked
                                ? "border-blue-500"
                                : "border-gray-700 opacity-75"}`, children: [_jsxs("div", { className: "flex items-center mb-4", children: [reward.isClaimed ? (_jsx(CheckCircle, { className: "w-6 h-6 text-green-500 mr-3" })) : reward.isUnlocked ? (_jsx(Unlock, { className: "w-6 h-6 text-blue-500 mr-3" })) : (_jsx(Lock, { className: "w-6 h-6 text-gray-500 mr-3" })), _jsx("h2", { className: "text-xl font-semibold", children: reward.title })] }), _jsx("p", { className: "text-gray-300 mb-4", children: reward.description }), reward.requiredPoints && (_jsxs("div", { className: "mb-4", children: [_jsxs("p", { className: "text-sm text-gray-400", children: ["Points Required: ", reward.requiredPoints] }), _jsx("div", { className: "w-full bg-gray-700 rounded-full h-2.5 overflow-hidden", children: _jsx(motion.div, { initial: { width: 0 }, animate: { width: `${Math.min((point / reward.requiredPoints) * 100, 100)}%` }, transition: { duration: 1, ease: "easeOut" }, className: "!bg-white h-2.5 rounded-full" }) })] })), reward.requiredStreak && (_jsxs("div", { className: "mb-4", children: [_jsxs("p", { className: "text-sm text-gray-400", children: ["Streak Required: ", reward.requiredStreak] }), _jsx("div", { className: "w-full !bg-gray-700 rounded-full h-2.5 overflow-hidden", children: _jsx(motion.div, { initial: { width: 0 }, animate: { width: `${Math.min((streak / reward.requiredStreak) * 100, 100)}%` }, transition: { duration: 1, ease: "easeOut" }, className: "!bg-purple-600 h-2.5 rounded-full" }) })] })), _jsx("button", { onClick: () => handleClaim(reward.rewardId), disabled: !reward.isUnlocked || reward.isClaimed, className: `!w-full py-2 !rounded-lg !font-medium !transition-colors ${reward.isClaimed
                                    ? "!bg-red-500 !text-white !cursor-not-allowed"
                                    : reward.isUnlocked
                                        ? "!bg-gradient-to-r !from-pink-400 to-purple-400 !text-white !hover:brightness-110 !animate-pulse"
                                        : "!bg-gray-600 !text-gray-400 !cursor-not-allowed"}`, children: reward.isClaimed ? "Claimed" : "Claim Reward" })] }, reward.rewardId))) })) })] }));
};
export default RewardsList;
