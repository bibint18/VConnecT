import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const PricingSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-black text-white px-4 sm:px-6 py-12 flex flex-col items-center ml-20 md:ml-64 pt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">Payment Successful!</h1>
        <p className="text-gray-300 mb-8">Your plan has been activated. Enjoy your new features!</p>
        <button
          onClick={() => navigate("/user/plans")}
          className="py-2 px-6 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 text-white font-semibold hover:brightness-110 transition-all duration-300"
        >
          Back to Plans
        </button>
      </motion.div>
    </div>
  );
};

export default PricingSuccess;