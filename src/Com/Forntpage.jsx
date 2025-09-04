import React, { memo, useMemo, useCallback } from 'react'
import Name from './Name'
import GlowingBall from './GlowingBall'
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { useOptimizedMouse, useOptimizedTransforms } from '../hooks/useOptimizedMouse';
import image from "../assets/image.png"
import image2 from "../assets/image2.png"
import Rightball from './Rightball';
import image3 from "../assets/image3.png"
import image5 from "../assets/image5.png"
import HackathonSection from './HackathonSection';
import logo from "../assets/logo.png"
import Timer from "./Timer"

// EPIC OPENING ANIMATION VARIANTS
const pageLoadSequence = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
      when: 'beforeChildren',
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

// Dramatic slide-in from opposite sides
const slideFromLeft = {
  hidden: { 
    x: -200, 
    opacity: 0, 
    scale: 0.8,
    filter: 'blur(10px)'
  },
  show: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { 
      type: 'spring', 
      stiffness: 120, 
      damping: 20,
      mass: 0.8,
      delay: 0.5
    }
  }
};

const slideFromRight = {
  hidden: { 
    x: 200, 
    opacity: 0, 
    scale: 0.8,
    filter: 'blur(10px)'
  },
  show: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { 
      type: 'spring', 
      stiffness: 120, 
      damping: 20,
      mass: 0.8,
      delay: 0.7
    }
  }
};

// Epic timer reveal
const timerReveal = {
  hidden: { 
    y: -100, 
    opacity: 0, 
    scale: 0.7,
    rotateX: -45
  },
  show: {
    y: 0,
    opacity: 1,
    scale: 1,
    rotateX: 0,
    transition: { 
      type: 'spring', 
      stiffness: 150, 
      damping: 25,
      delay: 0.9
    }
  }
};

// Background elements cascade
const backgroundCascade = {
  hidden: { opacity: 0, scale: 1.1, filter: 'blur(20px)' },
  show: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { 
      duration: 2,
      ease: [0.25, 0.1, 0.25, 1],
      delay: 0.2
    }
  }
};

// Floating particles animation
const floatingParticle = {
  animate: {
    y: [0, -20, 0],
    x: [0, 10, 0],
    opacity: [0.3, 0.7, 0.3],
    scale: [1, 1.1, 1],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  }
};

// Enhanced register button with dramatic entrance
const buttonEpicEntrance = {
  hidden: { 
    scale: 0,
    opacity: 0,
    rotate: -180,
    y: -50
  },
  show: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    y: 0,
    transition: { 
      type: 'spring', 
      stiffness: 200, 
      damping: 25,
      delay: 1.2
    }
  }
};

// Dynamic glow pulse effect
const glowPulse = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(139, 92, 246, 0.3)",
      "0 0 40px rgba(139, 92, 246, 0.6)",
      "0 0 20px rgba(139, 92, 246, 0.3)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const Forntpage = memo(() => {
  // Use optimized mouse tracking
  const { mouseX, mouseY } = useOptimizedMouse();
  const { bigX, bigY, smallX, smallY } = useOptimizedTransforms(mouseX, mouseY);
  const handleHeroComplete = useCallback(() => {}, []); // placeholder if parent wants hook later
  
  // Memoize scroll props to prevent recalculation
  const scrollProps = useMemo(() => {
    return window.innerWidth > 625 ? {
      'data-scroll': true,
      'data-scroll-speed': '-.9'
    } : {};
  }, []);

  // Floating Particles Component
  const FloatingParticles = () => {
    const particles = Array.from({ length: 12 }, (_, i) => (
      <motion.div
        key={i}
        variants={floatingParticle}
        animate="animate"
        className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-30"
        style={{
          left: `${10 + (i * 8)}%`,
          top: `${20 + (i % 3) * 20}%`,
          animationDelay: `${i * 0.2}s`
        }}
      />
    ));
    return <>{particles}</>;
  };

  return (
    <motion.div
      {...scrollProps}
      variants={pageLoadSequence}
      initial="hidden"
      animate="show"
      onAnimationComplete={handleHeroComplete}
      className='h-screen flex flex-col items-center justify-center w-full bg-[#0a0a0a] overflow-hidden will-change-transform relative'>
     
      {/* Floating Particles Background */}
      <div className="absolute inset-0 z-5">
        <FloatingParticles />
      </div>

      {/* Enhanced Timer with Epic Reveal */}
      <motion.div 
        variants={timerReveal}
        className='absolute md:top-4 lg:top-4 sm:top-[6px] top-20 h-8 sm:h-10 lg:text-5xl md:text-5xl sm:text-3xl text-xl md:bg-yllow-200/20 sm:bg-gren-600/20 lg:bg-rd-400/20 w-full bg-gree-400/30 flex justify-center items-center z-50 font-loadfont'
      >
        <motion.div
          variants={glowPulse}
          animate="animate"
          className="relative"
        >
          <Timer />
        </motion.div>
      </motion.div>
      
      {/* Logo with Dramatic Slide-in */}
      <motion.div 
        variants={slideFromLeft}
        className="absolute top-4 left-2 sm:left-4 md:left-6 lg:left-[-9px] md:h-[8vh] sm:h-[6vh] h-[5vh] bg-gren-300 z-50 ml-2 sm:ml-4 md:ml-6 lg:ml-7"
      >
        <motion.img
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 300 }}
          src={logo}
          alt="logo"
          className="h-full w-full object-contain filter drop-shadow-2xl"
        />
      </motion.div>
      
      {/* Epic Register Button with Entrance */}
      <motion.div
        variants={buttonEpicEntrance}
        className="absolute top-4 right-2 sm:right-4 md:right-6 lg:right-4 z-50 mr-2 sm:mr-4 md:mr-6 lg:mr-7"
      >
        <motion.button
          onClick={() => {
            window.open('https://vision.hack2skill.com/event/codefiestahackathon4/?utm_source=hack2skill&utm_medium=homepage&sectionid=68b6a3a3582ebb0d914d46aa', '_blank');
          }}
          whileHover={{ 
            scale: 1.1, 
            y: -5,
            boxShadow: "0 15px 40px rgba(139, 92, 246, 0.6)",
            filter: "brightness(1.1)"
          }}
          whileTap={{ scale: 0.9 }}
          variants={glowPulse}
          animate="animate"
          className="
            relative overflow-hidden group
            bg-gradient-to-r from-purple-600 via-blue-600 to-purple-700
            hover:from-purple-500 hover:via-blue-500 hover:to-purple-600
            text-white font-bold
            px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 lg:px-5 lg:py-2.5
            rounded-full
            text-xs sm:text-xs md:text-sm lg:text-base
            border border-white/20 hover:border-white/40
            backdrop-blur-sm
            shadow-md hover:shadow-lg
            transition-all duration-300 ease-out
            cursor-pointer
            font-loadfont
          "
        >
          {/* Enhanced Shine Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
            style={{ width: '60%' }}
          />
          
          {/* Pulsing Inner Glow */}
          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full"
          />
          
          {/* Button Text */}
          <span className="relative z-10 font-semibold tracking-wide">
            Register Now
          </span>
        </motion.button>
      </motion.div>
      
      {/* Enhanced Name Component with Slide Animation */}
      <motion.div
        variants={slideFromRight}
        className="relative z-40 mt-16 sm:mt-8 md:mt-0"
      >
        <Name />
      </motion.div>
      
      {/* Enhanced Background Layers with Cascade Effect */}
      <motion.div 
        variants={backgroundCascade}
        className='absolute h-screen w-full z-10'
      >
        <img src={image5} className='h-full w-full object-fill object-center opacity-90' alt="" />
      </motion.div>
      
      {/* Epic 4.0 Text with Typewriter Effect */}
      <div className="absolute inset-0 flex items-center justify-center w-full overflow-hidden z-10 pointer-events-none">
        <motion.div
          initial={{ 
            opacity: 0,
            scale: 0.5,
            rotateY: -90,
            filter: 'blur(20px)'
          }}
          animate={{
            opacity: 0.5,
            scale: 1,
            rotateY: 0,
            filter: 'blur(0px)'
          }}
          transition={{
            duration: 2,
            ease: [0.25, 0.1, 0.25, 1],
            delay: 1.5
          }}
          className="text-white font-bold select-none will-change-transform will-change-filter w-full text-center"
          style={{
            fontSize: typeof window !== 'undefined' && window.innerWidth < 640 
              ? 'min(70vw, 18rem)' 
              : 'clamp(18rem, 38vw, 38rem)',
            fontFamily: 'Impact, Arial Black, sans-serif',
            fontWeight: '600',
            textShadow: '0 0 40px rgba(200,200,200,0.3)',
            background: 'linear-gradient(45deg, rgba(220,220,220,0.7), rgba(180,180,180,0.8), rgba(160,160,160,0.75))',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'contrast(1.2) brightness(0.9)',
            letterSpacing: '0.02em',
            lineHeight: 1,
            margin: '0 auto'
          }}
        >
          <motion.span
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              delay: 2,
              duration: 0.8,
              ease: "easeOut"
            }}
          >
            4
          </motion.span>
          <motion.span
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              delay: 2.3,
              duration: 0.8,
              ease: "easeOut"
            }}
          >
            .0
          </motion.span>
        </motion.div>
      </div>
      
      {/* Enhanced Background Images with Parallax Effect */}
      <motion.img 
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.9, scale: 1 }}
        transition={{ duration: 3, ease: "easeOut", delay: 0.5 }}
        src={image} 
        className='absolute h-screen w-full object-top object-fill z-30' 
        alt="" 
      />
      <motion.img 
        initial={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
        animate={{ opacity: 0.8, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 3.5, ease: "easeOut", delay: 0.8 }}
        src={image2} 
        className='absolute h-screen w-full object-top z-30' 
        alt="" 
      />
      
      {/* Epic Main Animation Section */}
      <div className="relative w-full h-screen flex items-center -bottom-[200px] justify-center overflow-hidden">
        
        {/* Cinematic Light Rays */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 0.3, scale: 1 }}
          transition={{ duration: 2, delay: 1.8 }}
          className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-transparent z-5"
        />
        
        {/* Left Glowing Ball with Epic Entrance */}
        <motion.div 
          initial={{ x: -300, y: 200, opacity: 0, scale: 0 }}
          animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          transition={{ 
            type: 'spring', 
            stiffness: 100, 
            damping: 20,
            delay: 1.5
          }}
          className="absolute md:left-[390px] left-[-50px] sm:left-[-30px] -bottom-[275px] transform -translate-x-[65px] z-20"
        >
          <GlowingBall gradientColors="radial-gradient(circle, rgba(255,180,100,0.9) 0%, rgba(255,50,200,0.7) 50%, rgba(0,0,139,0.7) 80%)" />
        </motion.div>
        
        {/* Right Glowing Ball with Delayed Epic Entrance */}
        <motion.div 
          initial={{ x: 300, y: 200, opacity: 0, scale: 0 }}
          animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          transition={{ 
            type: 'spring', 
            stiffness: 100, 
            damping: 20,
            delay: 1.8
          }}
          className="absolute md:left-[390px] left-[50px] sm:left-[30px] -bottom-[275px] transform translate-x-[65px] z-10"
        >
          <GlowingBall gradientColors="radial-gradient(circle, rgba(100,200,255,0.9) 0%, rgba(50,150,255,0.7) 50%, rgba(0,0,139,0.7) 80%)" />
        </motion.div>
        
        {/* Epic Bigger Blue Div with Ground Emergence */}
        <motion.div
          initial={{ 
            y: 400, 
            opacity: 0, 
            scale: 0.8,
            rotateX: 45
          }}
          animate={{ 
            y: 0, 
            opacity: 1, 
            scale: 1,
            rotateX: 0
          }}
          transition={{ 
            type: 'spring', 
            stiffness: 80, 
            damping: 20,
            delay: 2.2
          }}
          style={{
            x: bigX,
            y: bigY,
            background: "linear-gradient(180deg, rgba(20,4,49,0.95) 0%, rgba(10,2,30,0.85) 100%)",
            boxShadow: "0 -10px 40px rgba(20,4,49,0.6), inset 0 5px 30px rgba(255,255,255,0.1)",
            border: "2px solid rgba(255,255,255,0.1)",
          }}
          className="md:h-[66vh] md:w-[65vw] sm:h-[60vh] sm:w-[70vw] h-[50vh] w-[80vw] absolute bottom-0 rounded-t-full z-40 backdrop-blur-lg"
        />
        
        {/* Epic Smaller Blue Div with Delayed Emergence */}
        <motion.div
          initial={{ 
            y: 350, 
            opacity: 0, 
            scale: 0.8,
            rotateX: 45
          }}
          animate={{ 
            y: 0, 
            opacity: 1, 
            scale: 1,
            rotateX: 0
          }}
          transition={{ 
            type: 'spring', 
            stiffness: 90, 
            damping: 22,
            delay: 2.6
          }}
          style={{
            x: smallX,
            y: smallY,
            background: "linear-gradient(180deg, rgba(30,10,80,0.8) 0%, rgba(15,5,40,0.7) 100%)",
            boxShadow: "0 -8px 30px rgba(30,10,80,0.5), inset 0 4px 20px rgba(255,255,255,0.1)",
            border: "2px solid rgba(255,255,255,0.15)",
          }}
          className="md:h-[56vh] md:w-[55vw] sm:h-[50vh] sm:w-[60vw] h-[45vh] w-[65vw] absolute bottom-0 rounded-t-full z-40 backdrop-blur-lg"
        />
        
        {/* Enhanced Shine overlay with Dynamic Glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3, duration: 1.5 }}
          style={{ x: smallX, y: smallY }}
          className="md:h-[56vh] md:w-[55vw] sm:h-[50vh] sm:w-[60vw] h-[45vh] w-[65vw] bottom-0 rounded-t-full z-50 relative overflow-hidden"
        >
          <motion.div
            animate={{
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.02, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 rounded-t-full pointer-events-none"
            style={{
              background: "radial-gradient(circle at center, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0) 70%)",
              boxShadow: "0 0 30px rgba(255,255,255,0.1), 0 0 60px rgba(255,255,255,0.05)",
              WebkitMask: "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.3))",
            }}
          />
        </motion.div>
        
        {/* Epic Floating glowing ball with Orbit Animation */}
        <motion.div 
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: 'spring', 
            stiffness: 150, 
            damping: 25,
            delay: 3.2
          }}
          className="absolute md:left-[400px] left-[-30px] sm:left-[-20px] bottom-[300px] h-[60px] w-[60px] sm:h-[80px] sm:w-[80px] md:h-[100px] md:w-[100px] transform -translate-x-[65px] z-40"
        >
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
            }}
            transition={{
              y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 8, repeat: Infinity, ease: "linear" }
            }}
          >
            <Rightball gradientColors="radial-gradient(circle, rgba(255,180,100,0.9) 0%, rgba(255,50,200,0.7) 50%, rgba(0,0,139,0.7) 80%)" />
          </motion.div>
        </motion.div>
        
        {/* Hero Character with Epic Entrance */}
        <motion.div
          initial={{ 
            y: 500, 
            opacity: 0, 
            scale: 0.6,
            filter: 'blur(20px)'
          }}
          animate={{ 
            y: 0, 
            opacity: 1, 
            scale: 1,
            filter: 'blur(0px)'
          }}
          transition={{ 
            type: 'spring', 
            stiffness: 70, 
            damping: 25,
            delay: 2.8
          }}
          style={{ x: smallX, y: smallY }}
          className="md:h-[77vh] md:w-[30vw] sm:h-[65vh] sm:w-[35vw] h-[55vh] w-[40vw] z-50 absolute bottom-[180px] sm:bottom-[160px] md:bottom-[180px]"
        >
          <motion.img
            whileHover={{ 
              scale: 1.05,
              filter: 'brightness(1.1) contrast(1.1)'
            }}
            transition={{ type: "spring", stiffness: 300 }}
            src={image3}
            className="h-full w-full object-cover object-center drop-shadow-2xl"
            alt="hero character"
          />
        </motion.div>
        
        {/* Random Stars  */}




         {/* <div className="absolute inset-0 -bottom-50 z-40">
          <StarDemo />
        </div>
        <div className="absolute inset-0 z-0 -bottom-50">
          <StarDemo />
        </div> */}
      </div>
      
      {/* Epic Hackathon Section with Grand Entrance */}
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 1.2, 
          ease: [0.25, 0.1, 0.25, 1],
          delay: 4
        }}
        className="w-full"
      >
        <HackathonSection />
      </motion.div>
    </motion.div>
  )
});

Forntpage.displayName = 'Forntpage';

export default Forntpage;