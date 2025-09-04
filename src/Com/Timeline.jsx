
import React, { useRef, useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars -- motion is used as a JSX factory (framer-motion components)
import { motion, useScroll, useTransform, useMotionValueEvent, useInView, AnimatePresence } from "framer-motion";
import { FaClock, FaUsers, FaRocket, FaLightbulb, FaCoffee, FaCode, FaNetworkWired, FaCheckCircle } from 'react-icons/fa';
import TimelineItem from './TimelineItem';

const Timeline = () => {
    const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 778 : false);
    const [isTablet, setIsTablet] = useState(typeof window !== 'undefined' ? window.innerWidth <= 1024 && window.innerWidth > 778 : false);
    const [activeEvent, setActiveEvent] = useState(null);

    const mainDivRef = useRef(null);
    const timelineRef = useRef(null);
    const titleRef = useRef(null);

    // Scroll-triggered animations
    const isTitleInView = useInView(titleRef, { once: true, margin: "-100px" });

    // Parallax effects for background elements
    const { scrollYProgress: parallaxProgress } = useScroll({
        target: mainDivRef,
        offset: ["start end", "end start"]
    });

    const parallaxY1 = useTransform(parallaxProgress, [0, 1], [0, -100]);
    const parallaxY2 = useTransform(parallaxProgress, [0, 1], [0, -200]);
    const parallaxOpacity = useTransform(parallaxProgress, [0, 0.5, 1], [0.3, 0.6, 0.3]);

    // Responsive breakpoints
    useEffect(() => {
        const checkDevice = () => {
            const width = window.innerWidth;
            setIsMobile(width <= 778);
            setIsTablet(width <= 1024 && width > 778);
        };
        
        checkDevice();
        window.addEventListener('resize', checkDevice);
        
        return () => window.removeEventListener('resize', checkDevice);
    }, []);

    // Scroll-based animations tied to the timeline wrapper with mobile optimization
    const { scrollYProgress } = useScroll({
        target: timelineRef,
        offset: ["start end", "end start"] // start when timeline enters, end when leaving viewport
    });

    // Progressive vertical line height with smoother mobile performance
    const progressiveHeight = useTransform(
        scrollYProgress, 
        [0, 1], 
        ["0%", "100%"]
    );
    
    const [progressValue, setProgressValue] = React.useState(0);
    useMotionValueEvent(scrollYProgress, 'change', (v) => setProgressValue(v));

    // Enhanced timeline data with icons and descriptions
    const timelineData = [
        { 
            time: "8:00 AM", 
            event: "Team Registration", 
            icon: <FaUsers />,
            description: "Get your team badges and welcome kit",
            color: "from-blue-500 to-cyan-500"
        },
        { 
            time: "10:00 AM", 
            event: "Opening Ceremony", 
            icon: <FaRocket />,
            description: "Welcome speech and event overview",
            color: "from-purple-500 to-pink-500"
        },
        { 
            time: "11:00 AM", 
            event: "Hackathon Begins", 
            icon: <FaCode />,
            description: "Start building your amazing projects",
            color: "from-green-500 to-emerald-500"
        },
        { 
            time: "2:00 PM", 
            event: "Mentor Sessions", 
            icon: <FaLightbulb />,
            description: "Get guidance from industry experts",
            color: "from-yellow-500 to-orange-500"
        },
        { 
            time: "4:00 PM", 
            event: "Coffee Break", 
            icon: <FaCoffee />,
            description: "Recharge with snacks and networking",
            color: "from-amber-500 to-yellow-500"
        },
        { 
            time: "5:00 PM", 
            event: "Workshop Session", 
            icon: <FaCode />,
            description: "Learn new technologies and tools",
            color: "from-indigo-500 to-purple-500"
        },
        { 
            time: "9:00 PM", 
            event: "Networking Dinner", 
            icon: <FaNetworkWired />,
            description: "Connect with fellow developers",
            color: "from-teal-500 to-blue-500"
        },
        { 
            time: "11:00 PM", 
            event: "Progress Check", 
            icon: <FaCheckCircle />,
            description: "Show your project progress",
            color: "from-red-500 to-pink-500"
        },
    ];

    // Floating animation for background elements with mobile optimization
    // Removed floatingVariants - now using parallax effects

    // Enhanced animation variants with mobile optimization
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: isMobile ? 0.05 : 0.15,
                delayChildren: isMobile ? 0.1 : 0.3,
                ease: "easeOut"
            }
        }
    };

    const titleVariants = {
        hidden: { 
            opacity: 0, 
            y: isMobile ? 30 : 50, 
            scale: isMobile ? 0.95 : 0.9,
            filter: isMobile ? "blur(5px)" : "blur(10px)"
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            transition: {
                duration: isMobile ? 0.5 : 0.8,
                ease: [0.25, 0.1, 0.25, 1],
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { 
            opacity: 0, 
            x: isMobile ? -30 : -60, 
            scale: 0.8,
            filter: "blur(5px)"
        },
        visible: {
            opacity: 1,
            x: 0,
            scale: 1,
            filter: "blur(0px)",
            transition: {
                type: "spring",
                stiffness: isMobile ? 150 : 120,
                damping: isMobile ? 25 : 20,
                mass: 0.8,
                duration: 0.6
            }
        }
    };

    return (
        <>
            <style>
                {`
                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.2); }
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }

                @keyframes gradient-shift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }

                @keyframes pulse-glow {
                    0%, 100% { 
                        box-shadow: 0 0 20px 5px rgba(59, 130, 246, 0.4), 
                                   0 0 40px 10px rgba(147, 51, 234, 0.3); 
                    }
                    50% { 
                        box-shadow: 0 0 30px 8px rgba(59, 130, 246, 0.6), 
                                   0 0 60px 15px rgba(147, 51, 234, 0.5); 
                    }
                }

                .timeline-dot {
                    animation: pulse-glow 3s ease-in-out infinite;
                }

                .event-card {
                    backdrop-filter: ${isMobile ? 'blur(8px)' : 'blur(12px)'};
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    transition: all ${isMobile ? '0.2s' : '0.4s'} cubic-bezier(0.4, 0, 0.2, 1);
                    transform-origin: left center;
                    z-index: 10;
                }

                .event-card:hover {
                    transform: translateX(${isMobile ? '5px' : '15px'}) scale(${isMobile ? '1.02' : '1.05'});
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 30px rgba(59, 130, 246, 0.5);
                    border-color: rgba(59, 130, 246, 0.5);
                }

                .title-text {
                    background: linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899, #06b6d4);
                    background-size: 400% 400%;
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: gradient-shift 4s ease-in-out infinite;
                }

                .time-badge {
                    background: linear-gradient(90deg, rgba(59, 130, 246, 0.95), rgba(147, 51, 234, 0.95));
                    border: 2px solid rgba(255, 255, 255, 0.5);
                    backdrop-filter: ${isMobile ? 'blur(6px)' : 'blur(12px)'};
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4), 0 0 20px rgba(59, 130, 246, 0.6);
                    z-index: 30;
                }

                .mobile-card {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.08));
                    backdrop-filter: ${isMobile ? 'blur(6px)' : 'blur(15px)'};
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .progress-line {
                    background: linear-gradient(to bottom, #3b82f6, #8b5cf6, #ec4899);
                    filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.5));
                }

                /* Mobile performance optimizations */
                @media (max-width: 778px) {
                    .event-card {
                        margin-left: 0;
                        width: calc(100vw - 120px);
                        max-width: 280px;
                        padding: 12px;
                        margin: 0 auto;
                        will-change: transform;
                    }
                    
                    .timeline-dot {
                        left: 12px !important;
                        will-change: transform;
                    }
                    
                    .time-badge {
                        left: 32px !important;
                        top: -4px !important;
                        z-index: 30 !important;
                        will-change: transform;
                    }

                    /* Disable expensive animations on mobile */
                    * {
                        -webkit-transform: translateZ(0);
                        transform: translateZ(0);
                    }
                }

                @media (max-width: 640px) {
                    .event-card {
                        width: calc(100vw - 100px);
                        max-width: 260px;
                        padding: 10px;
                    }
                    
                    .timeline-dot {
                        left: 10px !important;
                        width: 20px !important;
                        height: 20px !important;
                    }
                    
                    .time-badge {
                        left: 28px !important;
                        padding: 4px 8px !important;
                        font-size: 10px !important;
                        top: -4px !important;
                        z-index: 30 !important;
                    }
                }
                `}
            </style>

            <motion.div 
                ref={mainDivRef} 
                className={`relative min-h-screen flex flex-col justify-center overflow-hidden ${isMobile ? 'py-6' : 'py-12'}`}
                style={{
                    background: 'linear-gradient(to bottom, #000000 0%, #0f172a 50%, #1e293b 100%)',
                    position: 'relative' // Ensure non-static positioning for scroll calculations
                }}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Enhanced Background Stars with Parallax - Optimized for Mobile */}
                <div className="absolute inset-0 z-0">
                    {[...Array(isMobile ? 8 : 20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full bg-white"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                width: `${Math.random() * 2 + 1}px`,
                                height: `${Math.random() * 2 + 1}px`,
                                y: isMobile ? 0 : (i % 2 === 0 ? parallaxY1 : parallaxY2),
                                opacity: isMobile ? 0.2 : parallaxOpacity
                            }}
                            animate={isMobile ? {} : {
                                opacity: [0.2, 0.6, 0.2],
                                scale: [1, 1.1, 1]
                            }}
                            transition={isMobile ? {} : {
                                duration: Math.random() * 4 + 3,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: Math.random() * 1
                            }}
                        />
                    ))}
                </div>

                {/* Floating Background Elements with Parallax - Optimized for Mobile */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {!isMobile && (
                        <>
                            <motion.div
                                className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-2xl"
                                style={{ y: parallaxY1 }}
                                animate={{
                                    scale: [1, 1.05, 1],
                                    opacity: [0.05, 0.1, 0.05]
                                }}
                                transition={{
                                    duration: 12,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                            <motion.div
                                className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-2xl"
                                style={{ y: parallaxY2 }}
                                animate={{
                                    scale: [1.05, 1, 1.05],
                                    opacity: [0.08, 0.15, 0.08]
                                }}
                                transition={{
                                    duration: 15,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 3
                                }}
                            />
                        </>
                    )}
                </div>

                {/* Enhanced Title Section with Scroll Animation */}
                <motion.div 
                    ref={titleRef}
                    className={`text-center ${isMobile ? 'mb-6' : 'mb-10 md:mb-12'} relative z-10`}
                    variants={titleVariants}
                    initial="hidden"
                    animate={isTitleInView ? "visible" : "hidden"}
                >
                    <motion.h1 
                        className={`font-bold title-text drop-shadow-2xl ${isMobile ? 'mb-4' : 'mb-6'} ${
                            isMobile ? 'text-3xl' : isTablet ? 'text-5xl' : 'text-8xl'
                        }`}
                        variants={titleVariants}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                        TIMELINE
                    </motion.h1>
                    <motion.div 
                        className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto rounded-full shadow-lg"
                        style={{ width: isMobile ? 80 : 150 }}
                        initial={{ width: 0, opacity: 0 }}
                        animate={isTitleInView ? { width: isMobile ? 80 : 150, opacity: 1 } : { width: 0, opacity: 0 }}
                        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
                    />
                    <motion.p 
                        className={`text-gray-300 ${isMobile ? 'mt-2' : 'mt-4'} max-w-2xl mx-auto px-4 ${
                            isMobile ? 'text-xs' : 'text-lg'
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={isTitleInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        Join us for an exciting day of innovation, collaboration, and coding excellence
                    </motion.p>
                </motion.div>

                {/* Timeline Wrapper */}
                <motion.div 
                    ref={timelineRef}
                    className="relative flex justify-center items-center overflow-visible w-full"
                    style={{ position: 'relative' }} // Ensure proper positioning for scroll tracking
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    <div className={`relative ${isMobile ? 'w-full max-w-sm' : 'max-w-4xl w-full'} flex`}>
                        {/* Single Progressive Timeline Line */}
                        <div className={`absolute ${isMobile ? 'left-3' : 'left-8 md:left-16'} top-0 w-1 h-full pointer-events-none`}>
                            {/* Base track */}
                            <div className="absolute inset-0 bg-gray-700/30 rounded-full" />
                            {/* Progress fill */}
                            <motion.div
                                className="absolute top-0 left-0 w-full bg-gradient-to-b from-cyan-400 via-blue-500 to-purple-600 rounded-full shadow-[0_0_12px_rgba(59,130,246,0.6)]"
                                style={{ height: progressiveHeight }}
                            />
                            {/* Glow */}
                            <motion.div
                                className="absolute top-0 left-0 w-full bg-gradient-to-b from-white/60 via-cyan-200/40 to-transparent rounded-full blur-sm"
                                style={{ height: progressiveHeight, opacity: 0.6 }}
                            />
                        </div>

                        {/* Timeline Events with Scroll-Triggered Animations */}
                        <div className={`${isMobile ? 'space-y-8 w-full' : 'space-y-12 md:space-y-16'} ${isMobile ? 'py-4' : 'py-8'}`}>
                            {timelineData.map((item, index) => (
                                <TimelineItem
                                    key={index}
                                    item={item}
                                    index={index}
                                    isMobile={isMobile}
                                    isTablet={isTablet}
                                    activeEvent={activeEvent}
                                    setActiveEvent={setActiveEvent}
                                    progressValue={progressValue}
                                />
                            ))}
                        </div>

                        {/* Timeline End Indicator */}
                        <motion.div 
                            className={`absolute ${isMobile ? 'left-3' : 'left-6 md:left-14'} bottom-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 border-4 border-white shadow-lg`}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: timelineData.length * 0.1 + 0.5 }}
                        >
                            <FaCheckCircle className="absolute inset-0 m-auto text-white text-xs md:text-sm" />
                        </motion.div>
                    </div>
                </motion.div>

                {/* Call to Action */}
                <motion.div 
                    className={`text-center ${isMobile ? 'mt-8' : 'mt-16'} relative z-10 px-4`}
                    variants={itemVariants}
                >
                    <motion.button
                        className={`bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 ${
                            isMobile ? 'px-4 py-2 text-xs' : 'px-8 py-4 text-lg'
                        }`}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Join the Event
                    </motion.button>
                </motion.div>
            </motion.div>
        </>
    );
};

export default Timeline;
