import React, { useState, useEffect, useCallback } from "react";
import { RewardService, IReward } from "@/services/RewardService";
import { useAppSelector } from "@/redux/store";
import toast from "react-hot-toast";
import { Lock, Unlock, CheckCircle } from "lucide-react";
import { IUser } from "@/components/admin/dashboard/CustomerDashboard";

const RewardsList: React.FC = () => {
  const { userId} = useAppSelector((state) => state.user);
  const [rewards, setRewards] = useState<IReward[]>([]);
  const [loading, setLoading] = useState(true);
  const rewardService = new RewardService();
  const [userData,setUserData] = useState<IUser | null>(null)
  console.log("loaded")
  useEffect(() => {
    if (!userId) {
      toast.error("Please log in to view rewards");
      return;
    }

    const fetchRewards = async () => {
      try {
        console.log("fetched")
        setLoading(true);
        const userData = await rewardService.getUserDetails(userId as string)
        console.log("userDate",userData)
        setUserData(userData)
        const data = await rewardService.getRewards();
        console.log("rewards",data)
        setRewards(data);
      } catch (err:unknown) {
        toast.error(err instanceof Error ? err.message : 'Error!');
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, [userId]);


  const handleClaim =useCallback (async (rewardId: string) => {
    try {
      console.log("clicked claim ")
      console.log("clicked claim ",rewardId)
      await rewardService.claimReward(rewardId);
      setRewards((prev) =>
        prev.map((r) => (r.rewardId === rewardId ? { ...r, isClaimed: true } : r))
      );
      if(userId){
        const updatedUser = await rewardService.getUserDetails(userId)
        setUserData(updatedUser)
      }
      toast.success("Reward claimed!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to claim reward');
    }
  },[userId]);

  const handleCheckIn = async () => {
    try {
      await rewardService.checkIn();
      toast.success("Checked in successfully!");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to checkin');
    }
  };

  if (loading) return <div className="text-center py-12">Loading rewards...</div>;

  const point = userData?.point
  const streak = userData?.streak
  console.log("streak and point and rewards ",streak,point,rewards)
  if (!userData || point === undefined || streak === undefined) {
    return <div className="text-center py-12">Failed to load user data</div>;
  }
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Rewards</h1>
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-lg">Points: {point}</p>
          <p className="text-lg">Streak: {streak} days</p>
        </div>
        <button
          onClick={handleCheckIn}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Daily Check-In
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward) => (
          <div
            key={reward.rewardId}
            className={`p-6 rounded-lg shadow-lg transform transition duration-300 hover:scale-105 ${
              reward.isClaimed
                ? "bg-green-100 border-green-500"
                : reward.isUnlocked
                ? "bg-white border-blue-500"
                : "bg-gray-100 border-gray-300 opacity-75"
            } border-2`}
          >
            <div className="flex items-center mb-4">
              {reward.isClaimed ? (
                <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
              ) : reward.isUnlocked ? (
                <Unlock className="h-8 w-8 text-blue-500 mr-3" />
              ) : (
                <Lock className="h-8 w-8 text-gray-500 mr-3" />
              )}
              <h2 className="text-xl font-semibold">{reward.title}</h2>
            </div>
            <p className="text-gray-600 mb-4">{reward.description}</p>
            {reward.requiredPoints && (
              <div className="mb-2">
                <p>Points Required: {reward.requiredPoints}</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${Math.min((point / reward.requiredPoints) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
            {reward.requiredStreak && (
              <div className="mb-4">
                <p>Streak Required: {reward.requiredStreak}</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-purple-600 h-2.5 rounded-full"
                    style={{ width: `${Math.min((streak / reward.requiredStreak) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
            <button
              onClick={() => handleClaim(reward.rewardId)}
              disabled={!reward.isUnlocked || reward.isClaimed}
              className={`w-full py-2 rounded-lg font-medium ${
                reward.isClaimed
                  ? "bg-green-500 text-white cursor-not-allowed"
                  : reward.isUnlocked
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
            >
              {reward.isClaimed ? "Claimed" : "Claim Reward"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RewardsList;