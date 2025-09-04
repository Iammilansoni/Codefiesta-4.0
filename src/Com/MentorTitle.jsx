import React, { useRef } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from 'framer-motion';

const MentorTitle = () => {
    const titleRef = useRef(null);
    const isInView = useInView(titleRef, {
        once: true,
        margin: "-50px", // Reduced margin for faster triggering
        amount: 0.2 // Reduced threshold
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    const titleVariants = {
        hidden: { 
            x: -300,
            scaleX: 0,
            opacity: 0
        },
        visible: {
            x: 0,
            scaleX: 1,
            opacity: 1,
            transition: {
                duration: 1.2,
                ease: [0.25, 0.1, 0.25, 1],
                x: { duration: 0.8 },
                scaleX: { duration: 1.0, delay: 0.3 },
                opacity: { duration: 0.6 }
            }
        }
    };

    const decorativeVariants = {
        hidden: { 
            width: 0,
            opacity: 0
        },
        visible: {
            width: '100%',
            opacity: 1,
            transition: {
                duration: 1.5,
                delay: 0.8,
                ease: "easeOut"
            }
        }
    };

    const backgroundVariants = {
        hidden: { 
            scale: 0,
            opacity: 0
        },
        visible: {
            scale: 1,
            opacity: 0.1,
            transition: {
                duration: 2,
                delay: 0.5,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.div 
            ref={titleRef}
            className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Animated background circles */}
                <motion.div
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
                    variants={backgroundVariants}
                    animate={isInView ? "visible" : "hidden"}
                />
                <motion.div
                    className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"
                    variants={backgroundVariants}
                    animate={isInView ? "visible" : "hidden"}
                    transition={{ delay: 0.7 }}
                />
                
                {/* Floating particles - Reduced for performance */}
                {[...Array(10)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute rounded-full bg-white"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 2 + 1}px`,
                            height: `${Math.random() * 2 + 1}px`,
                        }}
                        animate={isInView ? {
                            opacity: [0.2, 0.6, 0.2],
                            scale: [1, 1.1, 1]
                        } : {}}
                        transition={{
                            duration: Math.random() * 2 + 1.5, // Faster animations
                            repeat: Infinity,
                            delay: Math.random() * 1
                        }}
                    />
                ))}
            </div>

            {/* Main Title Container */}
            <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
                {/* Main Title */}
                <motion.div
                    className="relative overflow-hidden"
                    variants={titleVariants}
                    style={{ transformOrigin: 'left center' }}
                >
                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 drop-shadow-2xl">
                        MENTORS
                    </h1>
                    
                    {/* Gradient overlay effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20"
                        initial={{ x: '-100%' }}
                        animate={isInView ? { x: '100%' } : { x: '-100%' }}
                        transition={{
                            duration: 1.5,
                            delay: 1.2,
                            ease: "easeInOut"
                        }}
                    />
                </motion.div>

                {/* Subtitle */}
                <motion.p 
                    className="text-lg md:text-xl lg:text-2xl text-gray-300 mt-6 max-w-2xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{
                        duration: 0.8,
                        delay: 1.5,
                        ease: "easeOut"
                    }}
                >
                    Meet our experienced mentors who will guide you through your hackathon journey
                </motion.p>

                {/* Decorative Line */}
                <motion.div 
                    className="relative mt-8 mx-auto h-1 max-w-md overflow-hidden"
                    variants={decorativeVariants}
                >
                    <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full"
                        variants={decorativeVariants}
                    />
                    
                    {/* Glowing effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full blur-sm opacity-50"
                        variants={decorativeVariants}
                    />
                </motion.div>

                {/* Side decorative elements */}
                <motion.div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-px bg-gradient-to-r from-transparent to-purple-500"
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{
                        duration: 1,
                        delay: 1.8,
                        ease: "easeOut"
                    }}
                    style={{ transformOrigin: 'left' }}
                />
                
                <motion.div
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-px bg-gradient-to-l from-transparent to-blue-500"
                    initial={{ scaleX: 0 }}
                    animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                    transition={{
                        duration: 1,
                        delay: 1.8,
                        ease: "easeOut"
                    }}
                    style={{ transformOrigin: 'right' }}
                />
            </div>

            {/* Bottom gradient fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
        </motion.div>
    );
};

export default MentorTitle;
