import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlanService, IPlan, IUserPlan } from "@/services/PlanService";
import toast from "react-hot-toast";
import { useAppSelector } from "@/redux/store";
import { useNavigate } from "react-router-dom";
import "./ListPlans.css";

const PricingPlans = () => {
  const [plans, setPlans] = useState<IPlan[]>([]);
  const [userPlan,setUserPlan] = useState<IUserPlan | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [userPlanLoading,setUserPlanLoading] = useState(true)
  const planService = new PlanService();
  const userId = useAppSelector((state) => state.user.userId);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const plansData = await planService.getPlans();
        setPlans(plansData);
        setLoading(false);
      } catch (error: unknown) {
        toast.error(
          error instanceof Error ? error.message : "Failed to fetch plans"
        );
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
      } catch (error: unknown) {
        toast.error(
          error instanceof Error ? error.message : "Failed to fetch user plan"
        );
        setUserPlanLoading(false);
      }
    };

    fetchPlans();
    fetchUserPlan();
  }, [userId]);

  const handleSelectPlan = async (planId: string) => {
    if (!userId) {
      toast.error("Please login to select a plan");
      navigate("/login");
      return;
    }
    setPaymentLoading(true);
    try {
      const plan = plans.find((p) => p._id === planId);
      if (!plan) throw new Error("Plan not found");
      const { approvalUrl } = await planService.createPayment(
        userId,
        planId,
        plan.discountAmount
      );
      window.location.href = approvalUrl;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to initiate payment"
      );
    }
  };

  if (loading || userPlanLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] bg-black text-white ml-20 md:ml-64 pt-16">
        Loading...
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] bg-black text-gray-400 ml-20 md:ml-64 pt-16">
        No plans available
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-black text-white px-4 sm:px-6 py-12 flex flex-col items-center   pt-16">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl sm:text-4xl font-bold mb-12 text-center"
      >
        Your Current Plan
      </motion.h1>



      {userPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl overflow-hidden border border-gray-800 shadow-lg bg-gray-900 w-full max-w-2xl mb-12"
        >
          <div className="relative p-6 sm:p-8 flex flex-col">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-200 mb-2">
              Your Current Plan: {userPlan.planName}
            </h2>
            <p className="text-sm text-gray-400 mb-4">
              Status: <span className={`capitalize ${userPlan.status === "active" ? "text-green-400" : "text-red-400"}`}>{userPlan.status}</span>
            </p>
            <div className="my-4 sm:my-6">
              <p className="text-sm text-gray-400">
                Purchased On: {new Date(userPlan.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
              <p className="text-sm text-gray-400">
                Expires On: {
                  userPlan.endDate
                    ? new Date(userPlan.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
                    : "N/A"
                }
              </p>
              <p className="text-sm text-gray-400">
                Transaction ID: {userPlan.transactionId || "N/A"}
              </p>
              <p className="text-sm text-gray-400">
                Room Benefit: {userPlan.roomBenefit} rooms
              </p>
            </div>
            {/* <button
              onClick={() => navigate("/plans")}
              className="w-full py-2 sm:py-3 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-semibold hover:brightness-110 transition-all duration-300 mt-4"
            >
              Change Plan
            </button> */}
          </div>
        </motion.div>
      )}

<motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl sm:text-4xl font-bold mb-12 text-center"
      >
        Choose Your New Plan
      </motion.h1>

      <AnimatePresence>
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 justify-center">
          {plans.map((plan) => (
            <motion.div
              key={plan._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`relative rounded-3xl overflow-hidden border border-gray-800 shadow-lg ${
                plan.isPopular
                  ? "bg-purple-600/50 backdrop-blur-sm popular-plan-glow"
                  : "bg-gray-900"
              } hover:scale-105 transition-transform duration-300`}
            >
              <div className="relative p-6 sm:p-8 flex flex-col h-full">
                {/* Plan name and description */}
                <div className="mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-200">
                    {plan.name}
                  </h2>
                  <p className="text-sm text-gray-400">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="my-4 sm:my-6">
                  <p className="text-3xl sm:text-4xl font-bold text-gray-200">
                    ${plan.discountAmount}
                    <span className="text-xl sm:text-2xl">
                      /{plan.duration}
                    </span>
                  </p>
                  {plan.regularAmount > plan.discountAmount && (
                    <p className="text-sm text-gray-400 line-through">
                      Regular: ${plan.regularAmount}
                    </p>
                  )}
                </div>

                {/* Radio button */}
                <div className="mb-4">
                  <button
                    onClick={() => setSelectedPlan(plan._id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === plan._id
                        ? "border-pink-400"
                        : "border-gray-400"
                    }`}
                  >
                    {selectedPlan === plan._id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="w-3 h-3 rounded-full bg-pink-400"
                      />
                    )}
                  </button>
                </div>

                {/* Select button */}
                <button
                  onClick={() => handleSelectPlan(plan._id)}
                  className="w-full py-2 sm:py-3 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-semibold hover:brightness-110 transition-all duration-300 mb-6 sm:mb-8"
                >
                  {paymentLoading ? "Processing..." : "Select Plan"}
                </button>

                {/* Divider */}
                <div className="w-full h-px bg-gray-700 mb-4 sm:mb-6" />

                {/* Benefits */}
                <div>
                  <p className="font-medium text-gray-200 mb-3 sm:mb-4">
                    What you will get
                  </p>
                  <ul className="space-y-2 sm:space-y-3">
                    {plan.benefits.map((benefit, index) => (
                      <li
                        key={index}
                        className="flex items-start text-gray-300 text-sm sm:text-base"
                      >
                        <span className="inline-flex items-center justify-center w-5 h-5 mr-2 rounded-full border border-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-3 w-3 text-gray-200"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default PricingPlans;
