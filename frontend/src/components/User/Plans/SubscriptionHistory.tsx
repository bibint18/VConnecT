// components/SubscriptionHistory.tsx
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IUserPlan, PlanService } from "@/services/PlanService";
import Pagination from "@/components/Pagination";
import Spinner from "@/components/Spinner";
import toast from "react-hot-toast";

interface Props {
  onClose: () => void;
}

const SubscriptionHistory: React.FC<Props> = ({ onClose }) => {
  const [plans, setPlans] = useState<IUserPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 4;

  const planService = useMemo(() => new PlanService(), []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await planService.getUserPlanHistory(page, limit);
        setPlans(res.plans);
        setTotal(res.total);
      } catch (error: any) {
        toast.error(error?.message || "Failed to load subscription history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [page, planService]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-2xl p-6 mx-4 relative"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">
              Subscription History
            </h2>
            <button
              onClick={onClose}
              className="text-pink-400 hover:underline text-sm"
            >
              Close
            </button>
          </div>

          {loading ? (
            <Spinner />
          ) : plans.length === 0 ? (
            <p className="text-gray-400">No subscription history found.</p>
          ) : (
            <>
              <div className="max-h-[60vh] overflow-y-auto pr-1">
                {plans.map((plan) => (
                  <div
                    key={plan.transactionId}
                    className="mb-4 border border-gray-800 rounded-xl p-4 bg-gray-950"
                  >
                    <p className="text-gray-200 font-semibold">
                      {plan.planName}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Status: {plan.status}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Start:{" "}
                      {new Date(plan.startDate).toLocaleDateString()}
                    </p>
                    <p className="text-gray-400 text-sm">
                      End:{" "}
                      {plan.endDate
                        ? new Date(plan.endDate).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Transaction: {plan.transactionId || "N/A"}
                    </p>
                  </div>
                ))}
              </div>
              <Pagination
                currentPage={page}
                totalPages={Math.ceil(total / limit)}
                onPageChange={setPage}
              />
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SubscriptionHistory;
