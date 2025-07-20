import React, { useState, useEffect, useCallback, useMemo } from "react";
import { RewardService, IReward } from "@/services/RewardService";
import { IUser } from "@/components/admin/dashboard/CustomerDashboard";
import { useAppSelector } from "@/redux/store";
import toast from "react-hot-toast";
import { Lock, Unlock, CheckCircle, Star, Sparkle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RewardFilter from "./RewardFilter";
import Pagination from "@/components/Pagination";
import Spinner from "@/components/Spinner";
import "./RewardList.css";

const RewardsList: React.FC = () => {
  const { userId } = useAppSelector((state) => state.user);
  const [rewards, setRewards] = useState<IReward[]>([]);
  const [userData, setUserData] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("title:asc");
  const [filter, setFilter] = useState("all");
  const [totalRewards, setTotalRewards] = useState(0);
  const rewardsPerPage = 6;
  const rewardService = useMemo(() => new RewardService(), []);

  const sortOptions = useMemo(
    () => [
      { label: "Title (A-Z)", value: "title:asc" },
      { label: "Title (Z-A)", value: "title:desc" },
      { label: "Points (Low to High)", value: "requiredPoints:asc" },
      { label: "Points (High to Low)", value: "requiredPoints:desc" },
      { label: "Streak (Low to High)", value: "requiredStreak:asc" },
      { label: "Streak (High to Low)", value: "requiredStreak:desc" },
    ],
    []
  );

  const filterOptions = useMemo(
    () => [
      { label: "All", value: "all" },
      { label: "Claimed", value: "claimed" },
      { label: "Not Claimed", value: "notClaimed" },
      { label: "Unlocked", value: "unlocked" },
      { label: "Locked", value: "locked" },
    ],
    []
  );

  useEffect(() => {
    if (!userId) {
      toast.error("Please log in to view rewards");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setFilterLoading(true);
        const [userData, rewardsData] = await Promise.all([
          rewardService.getUserDetails(userId as string),
          rewardService.getRewards(currentPage, rewardsPerPage, search, sort, filter), 
        ]);
        setUserData(userData);
        setRewards(rewardsData.rewards);
        setTotalRewards(rewardsData.total);
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setLoading(false);
        setFilterLoading(false);
      }
    };

    fetchData();
  }, [userId, currentPage, search, sort, filter, rewardService]); 

  const handleClaim = useCallback(
    async (rewardId: string) => {
      try {
        await rewardService.claimReward(rewardId);
        setRewards((prev) =>
          prev.map((r) =>
            r.rewardId === rewardId ? { ...r, isClaimed: true } : r
          )
        );
        if (userId) {
          const updatedUser = await rewardService.getUserDetails(userId);
          setUserData(updatedUser);
        }
        toast.success("Reward claimed!");
      } catch (err: unknown) {
        toast.error(
          err instanceof Error ? err.message : "Failed to claim reward"
        );
      }
    },
    [userId, rewardService]
  );

  const handleFilterChange = useCallback((search: string, sort: string, filter: string) => {
    setSearch(search);
    setSort(sort);
    setFilter(filter);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (
    !userData ||
    userData.point === undefined ||
    userData.streak === undefined
  ) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] text-red-500">
        Failed to load user data
      </div>
    );
  }

  const totalPages = Math.ceil(totalRewards / rewardsPerPage);
  const { point, streak } = userData;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-black text-white px-4 sm:px-6 py-6">
      <div className="relative bg-black/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-8 border border-pink-500/20 shadow-lg shadow-pink-500/10 overflow-hidden">
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
              Streak: {streak}{" "}
              <Sparkle className="inline w-4 h-4 text-purple-400" />
            </p>
            <p className="text-gray-200 font-medium">
              Points: {point}{" "}
              <Sparkle className="inline w-4 h-4 text-pink-400" />
            </p>
          </div>
          <div className="w-16 h-1 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full mt-2" />
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center">Your Rewards</h1>

      <RewardFilter
        sortOptions={sortOptions}
        filterOptions={filterOptions} 
        onFilterChange={handleFilterChange}
      />

      {filterLoading && (
        <div className="text-center text-gray-400 py-4">Loading rewards...</div>
      )}

      <AnimatePresence mode="wait">
        {!filterLoading && rewards.length === 0 ? (
          <motion.div
            key="no-rewards"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center text-gray-400 py-12"
          >
            No rewards available
          </motion.div>
        ) : (
          <motion.div
            key={`rewards-${search}-${sort}-${filter}-${currentPage}`} 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {rewards.map((reward) => (
              <motion.div
                key={reward.rewardId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
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
                    <p className="text-sm text-gray-400">
                      Points Required: {reward.requiredPoints}
                    </p>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(
                            (point / reward.requiredPoints) * 100,
                            100
                          )}%`,
                        }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="bg-white h-2.5 rounded-full"
                      />
                    </div>
                  </div>
                )}
                {reward.requiredStreak && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-400">
                      Streak Required: {reward.requiredStreak}
                    </p>
                    <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(
                            (streak / reward.requiredStreak) * 100,
                            100
                          )}%`,
                        }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="bg-purple-600 h-2.5 rounded-full"
                      />
                    </div>
                  </div>
                )}
                <button
                  onClick={() => handleClaim(reward.rewardId)}
                  disabled={!reward.isUnlocked || reward.isClaimed}
                  className={`w-full py-2 rounded-lg font-medium transition-colors ${
                    reward.isClaimed
                      ? "bg-red-500 text-white cursor-not-allowed"
                      : reward.isUnlocked
                      ? "bg-gradient-to-r from-pink-400 to-purple-400 text-white hover:brightness-110 animate-pulse"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {reward.isClaimed ? "Claimed" : "Claim Reward"}
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default RewardsList;