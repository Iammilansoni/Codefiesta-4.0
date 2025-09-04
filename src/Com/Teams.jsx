import React, { useRef, useState, useEffect, useMemo, useCallback, memo } from "react";
import {
    useMotionTemplate,
    useMotionValue,
    useSpring,
    useInView,
    motion,
    LazyMotion,
    domAnimation
} from "framer-motion";
import { FaLinkedin, FaTwitter, FaGithub, FaInstagram } from 'react-icons/fa';
import OptimizedImage from '../components/OptimizedImage';
import { useIntersectionLoader } from '../hooks/useIntersectionLoader';
import profilePho from '../assets/teams/teamimages.jpg';

// Memoized social dock component
const SocialDock = memo(({ isHovered }) => {
    const socialLinks = useMemo(() => [
        { icon: FaLinkedin, href: "https://linkedin.com", color: "text-blue-600", hoverColor: "hover:text-blue-500" },
        { icon: FaTwitter, href: "https://twitter.com", color: "text-blue-400", hoverColor: "hover:text-blue-300" },
        { icon: FaGithub, href: "https://github.com", color: "text-gray-800", hoverColor: "hover:text-gray-600" },
        { icon: FaInstagram, href: "https://instagram.com", color: "text-pink-600", hoverColor: "hover:text-pink-500" },
    ], []);

    return (
        <motion.div 
            className="bg-white/20 backdrop-blur-md rounded-full shadow-lg px-4 py-2 flex items-center space-x-4 border border-white/10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
                opacity: isHovered ? 1 : 0.8, 
                scale: isHovered ? 1 : 0.9,
                y: isHovered ? -5 : 0
            }}
            transition={{ duration: 0.3 }}
        >
            {socialLinks.map((social, index) => (
                <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${social.color} ${social.hoverColor} transition-all duration-300`}
                    whileHover={{ scale: 1.3, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <social.icon size={18} />
                </motion.a>
            ))}
        </motion.div>
    );
});

SocialDock.displayName = 'SocialDock';

// Optimized tilt card with reduced calculations
const TiltCard = memo(({ name, role, photo, size = "medium", index = 0 }) => {
    const ref = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const [shouldAnimate, setShouldAnimate] = useState(false);

    // Reduced rotation range for better performance
    const ROTATION_RANGE = 15;
    const HALF_ROTATION_RANGE = ROTATION_RANGE / 2;

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Less aggressive spring for better performance
    const xSpring = useSpring(x, { stiffness: 100, damping: 30 });
    const ySpring = useSpring(y, { stiffness: 100, damping: 30 });

    const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

    // Size configurations
    const sizeConfig = useMemo(() => ({
        small: { 
            card: "h-56 w-44", 
            text: "text-sm", 
            nameText: "text-lg",
            padding: "inset-3" 
        },
        medium: { 
            card: "h-72 w-56", 
            text: "text-base", 
            nameText: "text-xl",
            padding: "inset-4" 
        },
        large: { 
            card: "h-96 w-72", 
            text: "text-lg", 
            nameText: "text-2xl",
            padding: "inset-4" 
        }
    }), []);

    const config = sizeConfig[size];

    // Throttled mouse move handler
    const handleMouseMove = useCallback((e) => {
        if (!ref.current || !shouldAnimate) return;

        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
        const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

        const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
        const rY = mouseX / width - HALF_ROTATION_RANGE;

        x.set(rX);
        y.set(rY);
    }, [shouldAnimate, x, y, ROTATION_RANGE, HALF_ROTATION_RANGE]);

    const handleMouseLeave = useCallback(() => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
        setShouldAnimate(false);
    }, [x, y]);

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
        setShouldAnimate(true);
    }, []);

    // Reduced particle effects for better performance
    const particles = useMemo(() => 
        isHovered ? [...Array(3)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
                initial={{ 
                    x: Math.random() * 100 + "%", 
                    y: Math.random() * 100 + "%",
                    opacity: 0,
                    scale: 0
                }}
                animate={{ 
                    y: [null, Math.random() * -100 - 50],
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0]
                }}
                transition={{ 
                    duration: 1.5,
                    delay: i * 0.2,
                    ease: "easeOut"
                }}
            />
        )) : null
    , [isHovered]);

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseEnter={handleMouseEnter}
            style={{
                transformStyle: "preserve-3d",
                transform,
                willChange: shouldAnimate ? 'transform' : 'auto'
            }}
            className={`relative ${config.card} rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 shadow-2xl hover:shadow-purple-500/25 transition-shadow duration-500`}
            whileHover={{ scale: 1.02 }} // Reduced scale for better performance
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
                duration: 0.6, 
                delay: index * 0.1, // Staggered animation based on index
                ease: "easeOut"
            }}
        >
            <div
                style={{
                    transform: "translateZ(50px)", // Reduced Z translation
                    transformStyle: "preserve-3d",
                }}
                className={`absolute ${config.padding} flex flex-col justify-start items-center overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-xl`}
            >
                {/* Optimized image container */}
                <div className="h-full w-full overflow-hidden rounded-t-xl relative group">
                    <OptimizedImage 
                        src={photo || profilePho}
                        alt={name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content overlay */}
                <motion.div
                    style={{
                        transform: "translateZ(25px)",
                    }}
                    className="absolute flex flex-col items-center justify-center bg-gradient-to-t from-black/80 via-black/60 to-transparent text-white w-full h-full bottom-0 text-center font-bold transition-all duration-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0.9 }}
                >
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                        <motion.h3 
                            className={`${config.nameText} font-bold mb-1 drop-shadow-lg`}
                            animate={{ y: isHovered ? -3 : 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        >
                            {name}
                        </motion.h3>
                        {role && (
                            <motion.p 
                                className={`${config.text} text-gray-300 mb-3 drop-shadow-md`}
                                animate={{ y: isHovered ? -3 : 0 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.05 }}
                            >
                                {role}
                            </motion.p>
                        )}
                        <motion.div
                            animate={{ y: isHovered ? -3 : 8, opacity: isHovered ? 1 : 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
                        >
                            <SocialDock isHovered={isHovered} />
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Reduced particle effects */}
            {particles && (
                <div className="absolute inset-0 pointer-events-none">
                    {particles}
                </div>
            )}
        </motion.div>
    );
});

TiltCard.displayName = 'TiltCard';

// Optimized team section with lazy loading
const TeamSection = memo(({ title, subtitle, gradientFrom, gradientTo, children, delay = 0 }) => {
    const [ref, isIntersecting] = useIntersectionLoader({ 
        rootMargin: '100px',
        threshold: 0.1,
        delay: delay
    });

    return (
        <div ref={ref} className="flex flex-col items-center w-full justify-center">
            <motion.div 
                className="text-center mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={isIntersecting ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6 }}
            >
                <h2 className={`text-4xl md:text-6xl font-loadFont font-bold bg-gradient-to-r ${gradientFrom} ${gradientTo} bg-clip-text text-transparent mb-2`}>
                    {title}
                </h2>
                <p className="text-gray-400 text-lg">{subtitle}</p>
                <motion.div 
                    className={`w-24 h-0.5 bg-gradient-to-r ${gradientFrom} ${gradientTo} mx-auto mt-2 rounded-full`}
                    initial={{ width: 0 }}
                    animate={isIntersecting ? { width: 96 } : { width: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                />
            </motion.div>
            {isIntersecting && children}
        </div>
    );
});

TeamSection.displayName = 'TeamSection';

// Main optimized component
const Example = () => {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: true, margin: "-50px" });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isInView) {
            setIsVisible(true);
        }
    }, [isInView]);

    // Team data
    const teamData = useMemo(() => ({
        conveners: [
            { name: "Pradeep Jha", role: "Chief Convener" },
            { name: "IC Sharma", role: "Co-Convener" }
        ],
        developers: [
            { name: "Sahil Vais", role: "Full Stack Developer" },
            { name: "Rishi Goswami", role: "Frontend Developer" },
            { name: "Mukul Jain", role: "Backend Developer" },
            { name: "Sachin Gupta", role: "DevOps Engineer" }
        ],
        organizers: [
            { name: "Team Member", role: "Event Manager" },
            { name: "Team Member", role: "Logistics Head" },
            { name: "Team Member", role: "Marketing Lead" },
            { name: "Team Member", role: "Operations" }
        ],
        coordinators: [
            { name: "Team Member", role: "Technical Coordinator" },
            { name: "Team Member", role: "Student Coordinator" },
            { name: "Team Member", role: "Media Coordinator" },
            { name: "Team Member", role: "Relations Coordinator" }
        ]
    }), []);

    const containerVariants = useMemo(() => ({
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.1,
            }
        }
    }), []);

    const sectionVariants = useMemo(() => ({
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    }), []);

    return (
        <LazyMotion features={domAnimation}>
            <motion.div
                ref={containerRef}
                variants={containerVariants}
                initial="hidden"
                animate={isVisible ? "visible" : "hidden"}
                className="relative w-full flex flex-col items-center place-content-center bg-gradient-to-br from-black via-purple-900/20 to-blue-900/30 px-4 py-20 text-slate-900 overflow-hidden"
            >
                {/* Simplified background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
                </div>

                {/* Header */}
                <motion.div
                    variants={sectionVariants}
                    className="relative z-10 text-center mb-16"
                >
                    <motion.h1 
                        className="text-6xl md:text-8xl lg:text-9xl font-loadFont font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent mb-4"
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    >
                        OUR TEAM
                    </motion.h1>
                    <motion.div 
                        className="w-32 h-1 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"
                        initial={{ width: 0 }}
                        animate={isVisible ? { width: 128 } : { width: 0 }}
                        transition={{ delay: 0.5, duration: 1 }}
                    />
                    <motion.p 
                        className="text-gray-300 text-lg mt-4 max-w-2xl mx-auto"
                        initial={{ opacity: 0 }}
                        animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                    >
                        Meet the brilliant minds behind our innovation. Together, we create extraordinary experiences.
                    </motion.p>
                </motion.div>

                {/* Conveners Section */}
                <motion.div variants={sectionVariants} className="relative z-10 flex flex-col items-center w-full justify-center mb-20">
                    <TeamSection
                        title="Conveners"
                        subtitle="Leading the vision"
                        gradientFrom="from-purple-600"
                        gradientTo="to-pink-600"
                        delay={0}
                    >
                        <div className="flex justify-center items-center flex-wrap p-4 gap-8">
                            {teamData.conveners.map((member, index) => (
                                <TiltCard 
                                    key={member.name} 
                                    name={member.name} 
                                    role={member.role} 
                                    size="large" 
                                    index={index}
                                />
                            ))}
                        </div>
                    </TeamSection>
                </motion.div>

                {/* Developers Section */}
                <motion.div variants={sectionVariants} className="relative z-10 flex flex-col items-center w-full justify-center mb-20">
                    <TeamSection
                        title="Developers"
                        subtitle="Building the future"
                        gradientFrom="from-blue-600"
                        gradientTo="to-cyan-600"
                        delay={200}
                    >
                        <div className="flex justify-center items-center flex-wrap p-4 gap-6">
                            {teamData.developers.map((member, index) => (
                                <TiltCard 
                                    key={member.name} 
                                    name={member.name} 
                                    role={member.role} 
                                    size="medium" 
                                    index={index}
                                />
                            ))}
                        </div>
                    </TeamSection>
                </motion.div>

                {/* Organizers Section */}
                <motion.div variants={sectionVariants} className="relative z-10 flex flex-col items-center w-full justify-center mb-20">
                    <TeamSection
                        title="Organizers"
                        subtitle="Making it happen"
                        gradientFrom="from-green-600"
                        gradientTo="to-emerald-600"
                        delay={400}
                    >
                        <div className="flex justify-center items-center flex-wrap p-4 gap-6">
                            {teamData.organizers.map((member, index) => (
                                <TiltCard 
                                    key={`${member.role}-${index}`} 
                                    name={member.name} 
                                    role={member.role} 
                                    size="medium" 
                                    index={index}
                                />
                            ))}
                        </div>
                    </TeamSection>
                </motion.div>

                {/* Coordinators Section */}
                <motion.div variants={sectionVariants} className="relative z-10 flex flex-col items-center w-full justify-center">
                    <TeamSection
                        title="Coordinators"
                        subtitle="Connecting the dots"
                        gradientFrom="from-orange-600"
                        gradientTo="to-red-600"
                        delay={600}
                    >
                        <div className="flex justify-center items-center flex-wrap p-4 gap-6">
                            {teamData.coordinators.map((member, index) => (
                                <TiltCard 
                                    key={`${member.role}-${index}`} 
                                    name={member.name} 
                                    role={member.role} 
                                    size="small" 
                                    index={index}
                                />
                            ))}
                        </div>
                    </TeamSection>
                </motion.div>
            </motion.div>
        </LazyMotion>
    );
};
export default Example;