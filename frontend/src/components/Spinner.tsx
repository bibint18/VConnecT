
import { motion } from "framer-motion";

const Spinner = () => {
  const orbVariants = {
    animate: {
      scale: [1, 1.2, 1],
      rotate: 360,
      boxShadow: [
        "0 0 20px 5px rgba(236, 72, 153, 0.3)",
        "0 0 30px 10px rgba(168, 85, 247, 0.5)",
        "0 0 20px 5px rgba(236, 72, 153, 0.3)",
      ],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const particleVariants = {
    animate: (i: number) => ({
      rotate: 360,
      x: Math.cos(i * Math.PI / 2) * 60,
      y: Math.sin(i * Math.PI / 2) * 60,
      opacity: [0.3, 1, 0.3],
    }),
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black z-50">
      <motion.div
        className="w-48 h-48 rounded-full bg-gradient-to-r from-pink-400 to-purple-400"
        variants={orbVariants}
        animate="animate"
        transition={orbVariants.transition}
      >
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 rounded-full bg-pink-300"
            style={{ top: "50%", left: "50%" }}
            variants={particleVariants}
            animate="animate"
            custom={i}
            transition={particleVariants.transition}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default Spinner;