


import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const SubscriptionSection = () => {
  const navigate = useNavigate();

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)',
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    tap: { scale: 0.95 },
  };

  return (
    <motion.div
      className="bg-gradient-to-r from-purple-700 via-purple-600 to-indigo-600 text-white p-6 sm:p-8 rounded-xl mx-4 sm:mx-6 my-8 flex flex-col md:flex-row items-center justify-between shadow-lg"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <motion.div
        className="text-center md:text-left mb-6 md:mb-0"
        variants={textContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2
          className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight"
          variants={textVariants}
        >
          START ROOM HOSTING NOW
        </motion.h2>
        <motion.h3
          className="text-lg sm:text-xl md:text-2xl font-semibold mt-2 sm:mt-3 text-purple-100"
          variants={textVariants}
        >
          Subscribe to premium now!
        </motion.h3>
        <motion.p
          className="mt-2 sm:mt-3 text-sm sm:text-base md:text-lg text-gray-200"
          variants={textVariants}
        >
          Unlock room hosting and extra Benefits
        </motion.p>
      </motion.div>
      <motion.button
        onClick={() => navigate('/user/plans')}
        className="bg-white text-purple-700 font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-full border-2 border-transparent bg-clip-padding hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 hover:text-white hover:border-white transition-all duration-300"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
      >
        Subscribe
      </motion.button>
    </motion.div>
  );
};

export default SubscriptionSection;