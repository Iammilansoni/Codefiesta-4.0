import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const ResponsiveNavHeader = () => {
  const handleRegisterClick = () => {
    // Replace with your actual registration URL
    window.open('https://vision.hack2skill.com/event/codefiestahackathon4/?utm_source=hack2skill&utm_medium=homepage&sectionid=68b6a3a3582ebb0d914d46aa', '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="absolute top-0 left-0 right-0 z-50 w-full"
    >
      {/* Navigation Header */}
      <div className="flex items-center justify-between w-full px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8 lg:px-12 lg:py-10">
        
        {/* Logo - Left Side */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center"
        >
          <motion.img
            src="/src/assets/final logo.png"
            alt="Logo"
            className="h-8 w-auto sm:h-10 md:h-12 lg:h-14 xl:h-16 object-contain cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          />
        </motion.div>

        {/* Register Button - Right Side */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.button
            onClick={handleRegisterClick}
            whileHover={{ 
              scale: 1.05, 
              y: -2,
              boxShadow: "0 10px 30px rgba(139, 92, 246, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            className={`
              relative overflow-hidden group
              bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700
              hover:from-purple-500 hover:via-blue-500 hover:to-purple-600
              text-white font-bold
              px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 lg:px-8 lg:py-4
              rounded-full
              text-xs sm:text-sm md:text-base lg:text-lg
              border-2 border-white/20 hover:border-white/40
              backdrop-blur-sm
              shadow-lg hover:shadow-2xl
              transition-all duration-300 ease-out
              cursor-pointer
            `}
          >
            {/* Shine Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
              style={{ width: '50%' }}
            />
            
            {/* Button Text */}
            <span className="relative z-10 font-semibold tracking-wide">
              Register Now
            </span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ResponsiveNavHeader;
