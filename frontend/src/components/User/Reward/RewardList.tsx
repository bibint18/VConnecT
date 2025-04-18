// import React, { useState, useEffect, useCallback } from "react";
// import { RewardService, IReward } from "@/services/RewardService";
// import { useAppSelector } from "@/redux/store";
// import toast from "react-hot-toast";
// import { Lock, Unlock, CheckCircle } from "lucide-react";
// import { IUser } from "@/components/admin/dashboard/CustomerDashboard";

// const RewardsList: React.FC = () => {
//   const { userId} = useAppSelector((state) => state.user);
//   const [rewards, setRewards] = useState<IReward[]>([]);
//   const [loading, setLoading] = useState(true);
//   const rewardService = new RewardService();
//   const [userData,setUserData] = useState<IUser | null>(null)
//   console.log("loaded")
//   useEffect(() => {
//     if (!userId) {
//       toast.error("Please log in to view rewards");
//       return;
//     }

//     const fetchRewards = async () => {
//       try {
//         console.log("fetched")
//         setLoading(true);
//         const userData = await rewardService.getUserDetails(userId as string)
//         console.log("userDate",userData)
//         setUserData(userData)
//         const data = await rewardService.getRewards();
//         console.log("rewards",data)
//         setRewards(data);
//       } catch (err:unknown) {
//         toast.error(err instanceof Error ? err.message : 'Error!');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRewards();
//   }, [userId]);


//   const handleClaim =useCallback (async (rewardId: string) => {
//     try {
//       console.log("clicked claim ")
//       console.log("clicked claim ",rewardId)
//       await rewardService.claimReward(rewardId);
//       setRewards((prev) =>
//         prev.map((r) => (r.rewardId === rewardId ? { ...r, isClaimed: true } : r))
//       );
//       if(userId){
//         const updatedUser = await rewardService.getUserDetails(userId)
//         setUserData(updatedUser)
//       }
//       toast.success("Reward claimed!");
//     } catch (err: unknown) {
//       toast.error(err instanceof Error ? err.message : 'Failed to claim reward');
//     }
//   },[userId]);

//   const handleCheckIn = async () => {
//     try {
//       await rewardService.checkIn();
//       toast.success("Checked in successfully!");
//     } catch (err: unknown) {
//       toast.error(err instanceof Error ? err.message : 'Failed to checkin');
//     }
//   };

//   if (loading) return <div className="text-center py-12">Loading rewards...</div>;

//   const point = userData?.point
//   const streak = userData?.streak
//   console.log("streak and point and rewards ",streak,point,rewards)
//   if (!userData || point === undefined || streak === undefined) {
//     return <div className="text-center py-12">Failed to load user data</div>;
//   }
//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6 text-center">Your Rewards</h1>
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <p className="text-lg">Points: {point}</p>
//           <p className="text-lg">Streak: {streak} days</p>
//         </div>
//         <button
//           onClick={handleCheckIn}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//         >
//           Daily Check-In
//         </button>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {rewards.map((reward) => (
//           <div
//             key={reward.rewardId}
//             className={`p-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 ${
//               reward.isClaimed
//                 ? "bg-green-100 border-green-500"
//                 : reward.isUnlocked
//                 ? "bg-white border-blue-500"
//                 : "bg-gray-100 border-gray-300 opacity-75"
//             } border-2`}
//           >
//             <div className="flex items-center mb-4">
//               {reward.isClaimed ? (
//                 <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
//               ) : reward.isUnlocked ? (
//                 <Unlock className="h-8 w-8 text-blue-500 mr-3" />
//               ) : (
//                 <Lock className="h-8 w-8 text-gray-500 mr-3" />
//               )}
//               <h2 className="text-xl font-semibold">{reward.title}</h2>
//             </div>
//             <p className="text-gray-600 mb-4">{reward.description}</p>
//             {reward.requiredPoints && (
//               <div className="mb-2">
//                 <p>Points Required: {reward.requiredPoints}</p>
//                 <div className="w-full bg-gray-200 rounded-full h-2.5">
//                   <div
//                     className="bg-blue-600 h-2.5 rounded-full"
//                     style={{ width: `${Math.min((point / reward.requiredPoints) * 100, 100)}%` }}
//                   ></div>
//                 </div>
//               </div>
//             )}
//             {reward.requiredStreak && (
//               <div className="mb-4">
//                 <p>Streak Required: {reward.requiredStreak}</p>
//                 <div className="w-full bg-gray-200 rounded-full h-2.5">
//                   <div
//                     className="bg-purple-600 h-2.5 rounded-full"
//                     style={{ width: `${Math.min((streak / reward.requiredStreak) * 100, 100)}%` }}
//                   ></div>
//                 </div>
//               </div>
//             )}
//             <button
//               onClick={() => handleClaim(reward.rewardId)}
//               disabled={!reward.isUnlocked || reward.isClaimed}
//               className={`w-full py-2 rounded-lg font-medium ${
//                 reward.isClaimed
//                   ? "bg-green-500 text-white cursor-not-allowed"
//                   : reward.isUnlocked
//                   ? "bg-blue-600 text-white hover:bg-blue-700"
//                   : "bg-gray-400 text-gray-700 cursor-not-allowed"
//               }`}
//             >
//               {reward.isClaimed ? "Claimed" : "Claim Reward"}
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default RewardsList;



import React, { useState, useEffect, useCallback } from "react";
import { RewardService, IReward} from "@/services/RewardService";
import { IUser } from "@/components/admin/dashboard/CustomerDashboard";
import { useAppSelector } from "@/redux/store";
import toast from "react-hot-toast";
import { Lock, Unlock, CheckCircle, Star, Sparkle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import './RewardList.css'
const RewardsList: React.FC = () => {
  const { userId } = useAppSelector((state) => state.user);
  const [rewards, setRewards] = useState<IReward[]>([]);
  const [userData, setUserData] = useState<IUser | null>(null);
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
          rewardService.getUserDetails(userId as string),
          rewardService.getRewards(),
        ]);
        setUserData(userData);
        setRewards(rewardsData);
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleClaim = useCallback(
    async (rewardId: string) => {
      try {
        await rewardService.claimReward(rewardId);
        setRewards((prev) =>
          prev.map((r) => (r.rewardId === rewardId ? { ...r, isClaimed: true } : r))
        );
        if (userId) {
          const updatedUser = await rewardService.getUserDetails(userId);
          setUserData(updatedUser);
        }
        toast.success("Reward claimed!");
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Failed to claim reward");
      }
    },
    [userId]
  );

  // const handleCheckIn = useCallback(async () => {
  //   try {
  //     await rewardService.checkIn();
  //     if (userId) {
  //       const updatedUser = await rewardService.getUserDetails(userId);
  //       setUserData(updatedUser);
  //     }
  //     toast.success("Checked in successfully!");
  //   } catch (err: unknown) {
  //     toast.error(err instanceof Error ? err.message : "Failed to check in");
  //   }
  // }, [userId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] text-white">
        Loading rewards...
      </div>
    );
  }

  if (!userData || userData.point === undefined || userData.streak === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] text-red-500">
        Failed to load user data
      </div>
    );
  }

  const { point, streak } = userData;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-black text-white px-4 sm:px-6 py-6">
      {/* Check-In Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative bg-black/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-8 border border-pink-500/20 shadow-lg shadow-pink-500/10 overflow-hidden"
      >
        {/* <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div>
            <p className="text-gray-300 text-sm">
              <Star className="inline w-4 h-4 mr-1" /> Check in daily to earn rewards and boost your streak!
            </p>
            <p className="text-gray-400 text-xs">Unlock exclusive rewards with your streak.</p>
            <p className="text-gray-300">Streak: {streak} ⚡ | Points: {point}</p>
          </div>
        </div> */}

<div className="absolute inset-0 gradient-float" />
        <div className="relative flex flex-col items-center space-y-4 text-center">
          <p className="text-gray-200 text-sm sm:text-base font-semibold">
            <motion.span
              className="inline-block"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Star className="inline w-4 h-4 mr-1 text-yellow-400" />
            </motion.span>
            Check in daily to earn rewards and boost your streak!
          </p>
          <p className="text-gray-400 text-xs sm:text-sm">
            Unlock exclusive rewards with your streak and points.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <p className="text-gray-200 font-medium">
              Streak: {streak} <Sparkle className="inline w-4 h-4 text-purple-400" />
            </p>
            <p className="text-gray-200 font-medium">
              Points: {point} <Sparkle className="inline w-4 h-4 text-pink-400" />
            </p>
          </div>
          {/* Subtle Gradient Underline */}
          <div className="w-16 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mt-2" />
        </div>

      </motion.div>

      {/* Rewards Section */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-6 text-center"
      >
        Your Rewards
      </motion.h1>

      <AnimatePresence>
        {rewards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-gray-400 py-12"
          >
            No rewards available
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rewards.map((reward) => (
              <motion.div
                key={reward.rewardId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`relative bg-gray-900 rounded-xl p-6 shadow-lg hover:scale-105 transition-transform duration-300 border ${
                  reward.isClaimed
                    ? "border-green-500"
                    : reward.isUnlocked
                    ? "border-blue-500"
                    : "border-gray-700 opacity-75"
                }`}
              >
                <div className="flex items-center mb-4">
                  {reward.isClaimed ? (
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  ) : reward.isUnlocked ? (
                    <Unlock className="w-6 h-6 text-blue-500 mr-3" />
                  ) : (
                    <Lock className="w-6 h-6 text-gray-500 mr-3" />
                  )}
                  <h2 className="text-xl font-semibold">{reward.title}</h2>
                </div>
                <p className="text-gray-300 mb-4">{reward.description}</p>
                {reward.requiredPoints && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-400">Points Required: {reward.requiredPoints}</p>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((point / reward.requiredPoints) * 100, 100)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="!bg-white h-2.5 rounded-full"
                      />
                    </div>
                  </div>
                )}
                {reward.requiredStreak && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-400">Streak Required: {reward.requiredStreak}</p>
                    <div className="w-full !bg-gray-700 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((streak / reward.requiredStreak) * 100, 100)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="!bg-purple-600 h-2.5 rounded-full"
                      />
                    </div>
                  </div>
                )}
                <button
                  onClick={() => handleClaim(reward.rewardId)}
                  disabled={!reward.isUnlocked || reward.isClaimed}
                  className={`!w-full py-2 !rounded-lg !font-medium !transition-colors ${
                    reward.isClaimed
                      ? "!bg-red-500 !text-white !cursor-not-allowed"
                      : reward.isUnlocked
                      ? "!bg-gradient-to-r !from-pink-400 to-purple-400 !text-white !hover:brightness-110 !animate-pulse"
                      : "!bg-gray-600 !text-gray-400 !cursor-not-allowed"
                  }`}
                >
                  {reward.isClaimed ? "Claimed" : "Claim Reward"}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RewardsList;