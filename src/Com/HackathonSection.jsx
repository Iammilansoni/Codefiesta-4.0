import React, { useRef, useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars -- motion is used as JSX elements throughout the component
import { motion, useScroll, useTransform } from "framer-motion";
import { FaRegClock } from "react-icons/fa";

const HackathonSection = () => {
  const sectionRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Device detection for optimized animations
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);
  
  // Track scroll progress relative to the section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Mobile-optimized transforms with reduced movement
  const leftXViewport = useTransform(
    scrollYProgress, 
    [0, 0.5, 1], 
    isMobile ? [-150, 0, -150] : [-300, 0, -300]
  );
  const rightXViewport = useTransform(
    scrollYProgress, 
    [0, 0.5, 1], 
    isMobile ? [150, 0, 150] : [300, 0, 300]
  );
  const opacityViewport = useTransform(
    scrollYProgress, 
    [0, 0.2, 0.8, 1], 
    [0, 1, 1, 0]
  );

  return (
    <div
      ref={sectionRef}
      className="absolute top-[200px] sm:top-[180px] md:top-[200px] flex items-center justify-between w-full z-50 overflow-hidden
                 h-[25vh] sm:h-[30vh] md:h-[35vh] lg:h-[50vh] px-2 sm:px-4 md:px-6 lg:px-10"
    >
      {/* LEFT SIDE */}
      <motion.div
        initial={{ x: isMobile ? -150 : -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ 
          duration: isMobile ? 0.8 : 1, 
          ease: "easeOut",
          type: "spring",
          stiffness: isMobile ? 120 : 80,
          damping: isMobile ? 20 : 15
        }}
        style={{
          x: leftXViewport, // Using viewport-based transform
          opacity: opacityViewport,
        }}
        className="flex h-full w-[45vw] sm:w-[40vw] md:w-[25vw] lg:w-[20vw] mt-2 sm:mt-4 p-1 sm:p-2 md:p-4"
      >
        <motion.div
          className="flex items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 ml-1 sm:ml-4 md:ml-6 lg:ml-[95px]"
          animate={{ scale: [1, 1.05, 1], y: [0, -5, 0] }}
          transition={{ 
            duration: isMobile ? 2 : 3, 
            repeat: Infinity, 
            ease: "easeInOut",
            repeatDelay: isMobile ? 0.5 : 0
          }}
        >
          <FaRegClock className="text-[18px] sm:text-[24px] md:text-[30px] lg:text-[40px] text-red-500" />
          <div className="flex flex-col">
            <div className="text-[14px] sm:text-[18px] md:text-[24px] lg:text-[30px] text-red-50 font-loadfont font-semibold leading-3 sm:leading-4">
              24 hour
            </div>
            <div className="text-[14px] sm:text-[18px] md:text-[24px] lg:text-[30px] text-red-50 font-loadfont font-semibold">
              Hackathon
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* RIGHT SIDE */}
      <motion.div
        initial={{ x: isMobile ? 150 : 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ 
          duration: isMobile ? 0.8 : 1, 
          ease: "easeOut",
          type: "spring",
          stiffness: isMobile ? 120 : 80,
          damping: isMobile ? 20 : 15
        }}
        style={{
          x: rightXViewport, // Using viewport-based transform
          opacity: opacityViewport,
        }}
        className="flex h-full w-[60vw] sm:w-[40vw] md:w-[25vw] pt-2 sm:pt-3 md:pt-4 pr-4 sm:pr-8 md:mr-[60px]"
      >
        <motion.div
          className="flex items-center gap-2 sm:gap-3 md:gap-4"
          animate={{ scale: [1, 1.03, 1], y: [0, 5, 0] }}
          transition={{ 
            duration: isMobile ? 2.5 : 3, 
            repeat: Infinity, 
            ease: "easeInOut",
            repeatDelay: isMobile ? 0.3 : 0
          }}
        >
          <div className="flex flex-col gap-1 justify-center leading-tight sm:leading-5 md:leading-6 p-1 sm:p-2 md:p-3">
            <div className="text-[14px] sm:text-[20px] md:text-[30px] font-semibold text-red-500">
              2025
            </div>
            <div className="text-[14px] sm:text-[20px] md:text-[30px] font-semibold text-red-500">
              October
            </div>
          </div>
          <div className="flex flex-col border-l-2 border-red-600 pl-2 sm:pl-3">
            <div className="text-[12px] sm:text-[16px] md:text-[20px] leading-4 sm:leading-6 md:leading-6
                            p-1 sm:p-2 md:p-2 text-white font-loadfont font-semibold
                            w-[140px] sm:w-[180px] md:w-[210px]">
              Global Innovation Community Technology
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HackathonSection;