import React, { useRef } from 'react';
// eslint-disable-next-line no-unused-vars -- motion is used as a JSX factory (framer-motion components)
import { motion, useInView } from "framer-motion";
import { FaClock } from 'react-icons/fa';
import { getSpringConfig, getTransitionConfig } from '../hooks/useOptimizedScroll';
import { createTouchOptimizedVariants } from '../utils/scrollOptimization';

// TimelineItem component with individual scroll animations

const TimelineItem = ({ item, index, isMobile = false, isTablet = false, activeEvent, setActiveEvent, progressValue = 0 }) => {
    const itemRef = useRef(null);

    // More responsive inView detection for mobile with optimized scroll
    const isInView = useInView(itemRef, {
        once: true,
        margin: isMobile ? "-5px" : "-30px", // Even more sensitive margin for mobile
        amount: isMobile ? 0.02 : 0.15 // Very low threshold for mobile to trigger much earlier
    });

    // Mobile-optimized variants
    const itemVariants = createTouchOptimizedVariants(isMobile);
    const springConfig = getSpringConfig(isMobile);
    const transitionConfig = getTransitionConfig(isMobile, 0.6);

    // Safety check for required props
    if (!item) {
        console.error('TimelineItem: item prop is required');
        return null;
    }

    // Handle potential undefined setActiveEvent
    const handleSetActiveEvent = (value) => {
        if (typeof setActiveEvent === 'function') {
            setActiveEvent(value);
        }
    };

    return (
        <motion.div
            ref={itemRef}
            className="relative flex items-center"
            initial="initial"
            animate={isInView ? "animate" : "initial"}
            variants={itemVariants}
            onHoverStart={() => !isMobile && handleSetActiveEvent(index)}
            onHoverEnd={() => !isMobile && handleSetActiveEvent(null)}
            onTapStart={() => isMobile && handleSetActiveEvent(index)}
            onTap={() => isMobile && handleSetActiveEvent(null)}
        >
            {/* Timeline Dot with Enhanced Mobile Animation */}
            <motion.div
                className={`absolute ${isMobile ? 'left-3' : 'left-6 md:left-14'} w-6 h-6 md:w-8 md:h-8 rounded-full border-4 border-white z-20 timeline-dot bg-gradient-to-r ${item.color || 'from-blue-500 to-cyan-500'}`}
                initial={{ scale: 0, opacity: 0, rotate: -180 }}
                animate={isInView ? {
                    scale: 1,
                    opacity: 1,
                    rotate: 0
                } : { scale: 0, opacity: 0, rotate: -180 }}
                transition={{
                    delay: isMobile ? index * 0.02 : index * 0.08, // Much faster delays for mobile
                    ...springConfig,
                    duration: isMobile ? 0.3 : 0.5 // Faster duration for mobile
                }}
                whileHover={!isMobile ? { scale: 1.25 } : {}}
                whileTap={isMobile ? { scale: 1.1 } : {}}
            >
                <motion.div
                    className="absolute inset-0 rounded-full animate-ping bg-white/30"
                    animate={isMobile ? {} : { scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                    transition={isMobile ? {} : { duration: 2, repeat: Infinity }}
                />
                {/* Activation ring based on scroll position - faster for mobile */}
                <motion.div
                    className="absolute inset-0 rounded-full border-2 border-cyan-400"
                    style={{
                        scale: 1.15,
                        opacity: progressValue >= (index / 7) ? 1 : 0,
                        boxShadow: progressValue >= (index / 7) ? '0 0 16px rgba(34,211,238,0.6)' : 'none'
                    }}
                    animate={isMobile ? {} : { rotate: 360 }}
                    transition={isMobile ? {} : { duration: 3, repeat: Infinity, ease: "linear" }}
                />
            </motion.div>

            {/* Time Badge with Faster Mobile Animation */}
            <motion.div
                className={`absolute ${isMobile ? 'left-8' : 'left-16 md:left-28'} time-badge rounded-full px-3 py-1 md:px-4 md:py-2 font-semibold text-white text-xs md:text-sm whitespace-nowrap z-30`}
                initial={{ x: -30, opacity: 0, scale: 0.8 }}
                animate={isInView ? { x: 0, opacity: 1, scale: 1 } : { x: -30, opacity: 0, scale: 0.8 }}
                transition={{
                    delay: isMobile ? index * 0.02 + 0.1 : index * 0.08 + 0.2, // Faster delays
                    ...springConfig
                }}
            >
                <FaClock className="inline-block mr-1 text-xs" />
                {item.time || 'TBD'}
            </motion.div>

            {/* Event Card with Enhanced Mobile Scroll Animation */}
            <motion.div
                className={`${isMobile ? 'ml-16' : 'ml-32 md:ml-56'} event-card rounded-xl p-4 md:p-6 cursor-pointer group ${
                    isMobile ? 'mobile-card' : ''
                }`}
                style={{
                    width: isMobile ? 'calc(100vw - 120px)' : isTablet ? '400px' : '450px',
                    maxWidth: isMobile ? '280px' : 'none'
                }}
                initial={{ x: isMobile ? 15 : 30, opacity: 0, scale: isMobile ? 0.98 : 0.9, rotateX: isMobile ? 3 : 10 }}
                animate={isInView ? {
                    x: 0,
                    opacity: 1,
                    scale: 1,
                    rotateX: 0
                } : { x: isMobile ? 15 : 30, opacity: 0, scale: isMobile ? 0.98 : 0.9, rotateX: isMobile ? 3 : 10 }}
                transition={{
                    delay: isMobile ? index * 0.02 : index * 0.08 + 0.2, // Much faster for mobile
                    ...springConfig,
                    mass: isMobile ? 0.3 : 0.8 // Lighter mass for snappier mobile animations
                }}
                whileHover={!isMobile ? {
                    scale: 1.02,
                    x: 5,
                    transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 25
                    }
                } : {}}
                whileTap={isMobile ? {
                    scale: 0.98,
                    transition: { duration: 0.1 }
                } : {}}
                layout
            >
                <div className={`flex items-start ${isMobile ? 'gap-2' : 'gap-3 md:gap-4'}`}>
                    <motion.div
                        className={`flex-shrink-0 ${isMobile ? 'p-1.5' : 'p-2 md:p-3'} rounded-lg bg-gradient-to-r ${item.color} text-white shadow-lg`}
                        initial={{ scale: 0, rotate: -45 }}
                        animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -45 }}
                        transition={{
                            delay: isMobile ? index * 0.02 + 0.2 : index * 0.08 + 0.3, // Faster delays
                            ...springConfig
                        }}
                        whileHover={!isMobile ? {
                            rotate: 360,
                            scale: 1.1,
                            transition: { duration: 0.5 }
                        } : {}}
                        whileTap={isMobile ? {
                            scale: 1.05,
                            transition: { duration: 0.1 }
                        } : {}}
                    >
                        <div className={`${isMobile ? 'text-sm' : 'text-lg md:text-xl'}`}>
                            {item.icon || '📅'}
                        </div>
                    </motion.div>

                    <div className="flex-1 min-w-0">
                        <motion.h3
                            className={`font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent ${isMobile ? 'mb-1' : 'mb-2'} ${
                                isMobile ? 'text-xs' : 'text-sm md:text-lg'
                            }`}
                            initial={{ opacity: 0, y: isMobile ? 3 : 8 }}
                            animate={isInView ? {
                                opacity: activeEvent === index ? 1 : 0.9,
                                y: 0
                            } : { opacity: 0, y: isMobile ? 3 : 8 }}
                            transition={{
                                delay: isMobile ? index * 0.02 + 0.25 : index * 0.08 + 0.4, // Faster
                                ...transitionConfig
                            }}
                        >
                            {item.event || 'Event'}
                        </motion.h3>

                        <motion.p
                            className={`text-gray-300 ${
                                isMobile ? 'text-xs' : 'text-sm md:text-base'
                            }`}
                            initial={{ opacity: 0, y: isMobile ? 2 : 4 }}
                            animate={isInView ? {
                                opacity: activeEvent === index ? 1 : 0.7,
                                y: 0
                            } : { opacity: 0, y: isMobile ? 2 : 4 }}
                            transition={{
                                delay: isMobile ? index * 0.02 + 0.3 : index * 0.08 + 0.5, // Faster
                                ...transitionConfig
                            }}
                        >
                            {item.description || 'Event description'}
                        </motion.p>

                        {/* Mobile-specific touch indicator */}
                        {isMobile && (
                            <motion.div
                                className="text-xs text-blue-300 opacity-60 mt-1 flex items-center gap-1"
                                initial={{ opacity: 0 }}
                                animate={isInView ? { opacity: 0.6 } : { opacity: 0 }}
                                transition={{
                                    delay: isMobile ? index * 0.02 + 0.35 : index * 0.08 + 0.6, // Faster
                                    duration: 0.2
                                }}
                            >
                                <span>•</span> Tap for details
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Hover Effect Line with Faster Animation */}
                <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: activeEvent === index && isInView ? "100%" : 0 }}
                    transition={{
                        duration: isMobile ? 0.2 : 0.4, // Faster for mobile
                        ease: "easeOut"
                    }}
                />
            </motion.div>
        </motion.div>
    );
};

export default TimelineItem;
