import React from "react";
import { motion } from "framer-motion";

const letters = ["C", "O", "D", "E", "F", "I", "E", "S", "T", "A"];

// Container variant for orchestrated stagger matching hero sequence
const container = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.06,
      ease: [0.4, 0, 0.2, 1],
      duration: 0.4,
      delayChildren: 0.15
    }
  }
};

const letterVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.9, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 170,
      damping: 22,
      mass: 0.7
    }
  },
  hover: {
    y: [-2, 2, -2],
    scale: 1.18,
    transition: {
      duration: 2.2,
      repeat: Infinity,
      repeatType: 'mirror',
      ease: 'easeInOut'
    }
  }
};

const Name = () => {
  return (
    <div className="relative w-[70vw] sm:w-[75vw] md:w-[55vw] lg:w-[49vw] h-[8vh] sm:h-[12vh] md:h-[15vh] lg:h-[19vh] z-50 flex top-20 sm:top-16 md:top-18 lg:top-20 justify-center items-center">
      
      {/* Animated border */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full border-b-[1px] sm:border-b-[2px] md:border-b-[3px] lg:border-b-[4px] border-red-800 border-t-0 border-x-0"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        style={{ 
          transformOrigin: "left",
          position: "absolute"
        }}
      />

      {/* Animated Letters */}
  <motion.div
    variants={container}
    initial="hidden"
    animate="show"
    className="relative flex h-[10vh] sm:h-[14vh] md:h-[16vh] lg:h-[18vh] xl:h-[20vh] z-40 text-[24px] sm:text-[40px] md:text-[70px] lg:text-[90px] xl:text-[100px] tracking-tighter font-bold font-loadfont text-white w-full justify-center items-center will-change-transform will-change-filter">
        {letters.map((letter, index) => (
          <motion.div
            key={index}
            initial={false}
            whileHover="hover"
            variants={letterVariants}
            className="relative mx-[1px] sm:mx-[2px] md:mx-[3px] lg:mx-[4px]"
            style={{ position: "relative" }}
          >
            {letter}
          </motion.div>
        ))}
  </motion.div>

      {/* Gradient Heading */}
      <div className="flex absolute bg-red-400 leading-tight tracking-tighter font-semibold justify-center font-loadfont 
        text-[8vw] sm:text-[7vw] md:text-[5vw] lg:text-[4vw] xl:text-[104px]
        top-12 sm:top-20 md:top-24 lg:top-28 xl:top-36 items-center 
        w-[85vw] sm:w-[75vw] md:w-[65vw] lg:w-[55vw] xl:w-[50vw]
        h-[10vh] sm:h-[14vh] md:h-[16vh] lg:h-[18vh] xl:h-[20vh] 
        z-50 bg-clip-text text-transparent 
        bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600">
        HACKA
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600">
          THON
        </span>
      </div>
    </div>
  );
};

export default Name;
