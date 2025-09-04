import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const HeroHeader = () => {
  const handleRegisterClick = () => {
    // Replace with your actual registration URL
    window.open('https://vision.hack2skill.com/event/codefiestahackathon4/?utm_source=hack2skill&utm_medium=homepage&sectionid=68b6a3a3582ebb0d914d46aa', '_blank');
  };

  // Animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
        staggerChildren: 0.2
      }
    }
  };

  const logoVariants = {
    hidden: { opacity: 0, x: -50, scale: 0.8 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, x: 50, scale: 0.8 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.header
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className="absolute top-0 left-0 right-0 z-50 w-full"
    >
      {/* Header Container */}
      <div className="flex items-center justify-between w-full px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 lg:px-12 lg:py-10">
        
        {/* Logo Section - Left */}
        <motion.div
          variants={logoVariants}
          className="flex items-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="cursor-pointer"
          >
            {/* Logo Image */}
            <img
              src="/src/assets/final logo.png"
              alt="Website Logo"
              className="h-8 w-auto sm:h-10 md:h-12 lg:h-14 xl:h-16 object-contain"
            />
          </motion.div>
          
          {/* Optional Logo Text (uncomment if needed) */}
          {/* <motion.div className="ml-3 hidden sm:block">
            <h1 className="text-white font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl">
              YourBrand
            </h1>
          </motion.div> */}
        </motion.div>

        {/* Register Button Section - Right */}
        <motion.div
          variants={buttonVariants}
          className="flex items-center"
        >
          <motion.button
            onClick={handleRegisterClick}
            whileHover={{ 
              scale: 1.05, 
              y: -2,
              boxShadow: "0 20px 40px rgba(139, 92, 246, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            className={`
              relative overflow-hidden
              bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700
              hover:from-purple-500 hover:via-blue-500 hover:to-purple-600
              text-white font-bold
              px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 lg:px-10 lg:py-5
              rounded-full
              text-sm sm:text-base md:text-lg lg:text-xl
              border-2 border-white/20 hover:border-white/40
              backdrop-blur-sm
              shadow-lg hover:shadow-2xl
              transition-all duration-300 ease-out
              cursor-pointer
              group
            `}
          >
            {/* Button Background Glow Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"
              initial={{ scale: 0 }}
              whileHover={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            
            {/* Button Text */}
            <span className="relative z-10 font-semibold tracking-wide">
              Register Now
            </span>
            
            {/* Shine Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-700"
              style={{ width: '50%' }}
            />
          </motion.button>
        </motion.div>
      </div>

      {/* Optional Divider Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
        className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-4 sm:mx-6 md:mx-8 lg:mx-12"
        style={{ transformOrigin: 'left' }}
      />
    </motion.header>
  );
};

export default HeroHeader;
