import React, { useState, useEffect } from 'react'
// eslint-disable-next-line no-unused-vars -- motion is used as JSX elements throughout the component
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import EventHeader from './EventHeader'
import FloatingStars from './FloatingStars'
import { FaLightbulb, FaUsers, FaGraduationCap, FaArrowRight, FaRocket, FaStar, FaCode, FaHandshake, FaBook } from 'react-icons/fa'

const About = () => {
  // Function to wrap each word in a span with hover effect
  const wrapWords = (text) => {
    return text.split(' ').map((word, index) => (
      <span
        key={index}
        className="relative transition-all duration-300 ease-in-out cursor-default hover:text-purple-600"
        style={{
          textShadow:
            '0 0 500px rgba(147,51,234,0), 0 0 10px rgba(147,51,234,0), 0 0 20px rgba(147,51,234,0)',
        }}
        onMouseEnter={(e) => {
          e.target.style.textShadow =
            '0 0 500px rgba(147,51,234,0.6), 0 0 15px rgba(147,51,234,0.8), 0 0 25px rgba(147,51,234,1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.textShadow =
            '0 0 500px rgba(147,51,234,0), 0 0 10px rgba(147,51,234,0), 0 0 20px rgba(147,51,234,0)';
        }}
      >
        {word}{' '}
      </span>
    ));
  };

  return (
    <div className="min-h-[200vh] md:min-h-[220vh] bg-gradient-to-br from-gray-900 via-black to-purple-900/30 w-full flex flex-col z-50 relative overflow-hidden">
      {/* Enhanced Animated background particles */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-10 left-10 w-3 h-3 bg-purple-500 rounded-full animate-pulse shadow-lg shadow-purple-500/50"></div>
        <div className="absolute top-32 right-20 w-2 h-2 bg-blue-400 rounded-full animate-ping shadow-lg shadow-blue-400/50"></div>
        <div className="absolute top-64 left-1/4 w-2.5 h-2.5 bg-pink-400 rounded-full animate-pulse shadow-lg shadow-pink-400/50"></div>
        <div className="absolute bottom-32 right-10 w-3 h-3 bg-cyan-400 rounded-full animate-ping shadow-lg shadow-cyan-400/50"></div>
        <div className="absolute bottom-64 left-16 w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-lg shadow-yellow-400/50"></div>
        <div className="absolute top-1/2 right-1/3 w-2.5 h-2.5 bg-green-400 rounded-full animate-ping shadow-lg shadow-green-400/50"></div>
        <div className="absolute top-20 right-1/4 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse shadow-lg shadow-indigo-400/50"></div>
        <div className="absolute bottom-20 left-1/3 w-2 h-2 bg-rose-400 rounded-full animate-ping shadow-lg shadow-rose-400/50"></div>
      </div>
      
      {/* Enhanced Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/15 via-transparent to-green-900/15 pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent pointer-events-none"></div>
      
      <div className="border-b-2 border-gradient flex whitespace-nowrap overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-pink-600/20 animate-pulse"></div>
        <EventHeader />
      </div>
      <div className="min-h-[120vh] md:min-h-[140vh] p-6 pt-20 pb-20 bg-gradient-to-br from-gray-900 via-black to-purple-900/30 flex-col flex items-center justify-start relative backdrop-blur-sm">
        <InnovationSection wrapWords={wrapWords} />
        {/* <FloatingStars /> */}
      </div>
    </div>
  )
}

// Enhanced Innovation Section Component
const InnovationSection = ({ wrapWords }) => {
  const [activeCard, setActiveCard] = useState(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)
  
  const sectionRef = React.useRef(null)
  
  // Device detection
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })
  
  // Mobile-optimized opacity transform
  const opacity = useTransform(
    scrollYProgress, 
    [0, 0.2, 0.8, 1], 
    [0, 1, 1, 0]
  )
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const cards = [
    {
      id: 'innovation',
      title: 'OPEN INNOVATION',
      icon: FaCode,
      gradient: 'from-purple-400 via-pink-400 to-purple-600',
      bgGradient: 'from-purple-500/10 to-pink-500/10',
      borderColor: 'purple-400/30',
      shadowColor: 'purple-500/20',
      glowColor: 'purple-400',
      description: 'Unleash creativity without boundaries! Our hackathon is a cosmic playground where wild ideas collide, spark, and transform into revolutionary solutions. From mind-bending prototypes to eureka moments that hit harder than caffeine, innovation here isn\'t just encouraged—it\'s inevitable.',
      features: ['💡 Breakthrough Ideas', '🎨 Creative Freedom', '⚡ Rapid Prototyping', '🧪 Innovation Labs']
    },
    {
      id: 'collaboration',
      title: 'COLLABORATION',
      icon: FaHandshake,
      gradient: 'from-blue-400 via-cyan-400 to-blue-600',
      bgGradient: 'from-blue-500/10 to-cyan-500/10',
      borderColor: 'blue-400/30',
      shadowColor: 'blue-500/20',
      glowColor: 'blue-400',
      description: 'Join the ultimate global developer party! Connect with brilliant minds from every corner of the world, share epic ideas, debug legendary challenges, and craft solutions that make the impossible possible. Time zones are just numbers when genius unites.',
      features: ['🌍 Global Network', '👥 Team Building', '💬 Knowledge Sharing', '🤝 Cross-Cultural Innovation']
    },
    {
      id: 'learning',
      title: 'LEARNING',
      icon: FaBook,
      gradient: 'from-green-400 via-emerald-400 to-green-600',
      bgGradient: 'from-green-500/10 to-emerald-500/10',
      borderColor: 'green-400/30',
      shadowColor: 'green-500/20',
      glowColor: 'green-400',
      description: 'Dive into the ultimate skill-expansion adventure! Level up your abilities through hands-on challenges, expert mentorship, and real-world problem solving. Every line of code, every solution, every failure is a stepping stone to developer greatness.',
      features: ['📈 Skill Development', '👨‍🏫 Expert Mentorship', '🛠️ Hands-on Challenges', '💼 Industry Insights']
    }
  ]

  // Create refs for each card
  const cardRefs = React.useRef([])
  
  // Initialize refs array
  React.useEffect(() => {
    cardRefs.current = cardRefs.current.slice(0, cards.length)
  }, [cards.length])
  
  // Create inView hooks for each card
  const isCardInView = []
  for (let i = 0; i < cards.length; i++) {
    if (!cardRefs.current[i]) {
      cardRefs.current[i] = React.createRef()
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    isCardInView[i] = useInView(cardRefs.current[i], {
      once: true,
      margin: isMobile ? "-20px" : "-100px",
      amount: isMobile ? 0.1 : 0.3
    })
  }

  return (
    <motion.div
      ref={sectionRef}
      style={{ opacity }}
      className="w-full h-full relative"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated orbs with mobile optimization */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl"
          animate={{
            x: isMobile ? [0, 50, 0] : [0, 100, 0],
            y: isMobile ? [0, -25, 0] : [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            duration: isMobile ? 6 : 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 bg-blue-500/20 rounded-full blur-xl"
          animate={{
            x: isMobile ? [0, -40, 0] : [0, -80, 0],
            y: isMobile ? [0, 30, 0] : [0, 60, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{ 
            duration: isMobile ? 5 : 6, 
            repeat: Infinity, 
            ease: "easeInOut", 
            delay: 1 
          }}
        />
        <motion.div
          className="absolute bottom-32 left-1/3 w-40 h-40 bg-green-500/15 rounded-full blur-xl"
          animate={{
            x: isMobile ? [0, 30, 0] : [0, 60, 0],
            y: isMobile ? [0, -20, 0] : [0, -40, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ 
            duration: isMobile ? 8 : 10, 
            repeat: Infinity, 
            ease: "easeInOut", 
            delay: 2 
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full min-h-full md:p-20 md:gap-12 items-start justify-start flex flex-col gap-12 sm:gap-16 font-semibold font-loadfont text-neutral-300 mt-12 p-6 sm:p-8 pb-20">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="w-full text-center mb-16 md:mb-20 relative pt-8 md:pt-12"
        >
          <motion.div
            className="inline-flex items-center justify-center gap-2 sm:gap-4 px-4 sm:px-8 md:px-10 py-4 sm:py-5 md:py-6 bg-gradient-to-r from-purple-500/15 via-blue-500/15 to-green-500/15 rounded-full border border-white/30 backdrop-blur-md mb-8 shadow-2xl mx-auto w-fit"
            whileHover={{ scale: 1.05, y: -8, boxShadow: "0 25px 50px rgba(147, 51, 234, 0.4)" }}
            transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="flex-shrink-0"
            >
              <FaRocket className="text-xl sm:text-2xl md:text-3xl text-purple-400" />
            </motion.div>
            <span className="text-lg sm:text-xl md:text-3xl lg:text-4xl bg-gradient-to-r from-white via-purple-300 to-green-300 bg-clip-text text-transparent font-bold tracking-wide text-center px-2">
              Empowering Innovation Through Unity
            </span>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="flex-shrink-0"
            >
              <FaStar className="text-xl sm:text-2xl md:text-3xl text-green-400" />
            </motion.div>
          </motion.div>
          
          {/* Enhanced subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-lg md:text-xl text-neutral-400 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Join the most exciting hackathon experience where creativity meets technology, 
            innovation sparks collaboration, and learning never stops!
          </motion.p>
          
          <motion.div 
            className="w-full h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2, delay: 1 }}
          />
        </motion.div>

        {/* Cards Grid with Optimized Scroll Performance */}
        <div className="w-full grid md:grid-cols-3 grid-cols-1 gap-10 md:gap-8 max-w-7xl mx-auto mt-8 md:mt-12">
          {cards.map((card, index) => {
            const IconComponent = card.icon
            
            return (
              <motion.div
                key={card.id}
                ref={cardRefs.current[index]}
                initial={{ opacity: 0, y: isMobile ? 30 : 50, scale: 0.95 }}
                animate={isCardInView[index] ? { 
                  opacity: 1, 
                  y: 0, 
                  scale: 1 
                } : { 
                  opacity: 0, 
                  y: isMobile ? 30 : 50, 
                  scale: 0.95 
                }}
                transition={{ 
                  duration: isMobile ? 0.4 : 0.6, 
                  delay: isMobile ? index * 0.1 : index * 0.15,
                  type: isMobile ? "tween" : "spring",
                  stiffness: isMobile ? undefined : 100,
                  ease: isMobile ? "easeOut" : undefined
                }}
                className="group flex flex-col h-full relative perspective-1000"
                onMouseEnter={() => !isMobile && setActiveCard(card.id)}
                onMouseLeave={() => !isMobile && setActiveCard(null)}
                onTouchStart={() => isMobile && setActiveCard(card.id)}
                onTouchEnd={() => isMobile && setActiveCard(null)}
              >
                {/* Card Container with Performance Optimizations */}
                <motion.div
                  className={`
                    relative h-full bg-gradient-to-br ${card.bgGradient} backdrop-blur-xl
                    border-2 border-white/20 rounded-3xl overflow-visible
                    transition-all duration-300 group-hover:border-white/40
                    shadow-2xl group-hover:shadow-3xl min-h-[700px] max-h-none
                    flex flex-col w-full will-change-transform
                  `}
                  whileHover={!isMobile ? { 
                    scale: 1.02, 
                    y: -5,
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
                    transition: { duration: 0.2, ease: "easeOut" }
                  } : {}}
                  whileTap={isMobile ? {
                    scale: 0.98,
                    transition: { duration: 0.1 }
                  } : {}}
                  style={{
                    background: `linear-gradient(135deg, ${card.bgGradient.includes('purple') ? 'rgba(147, 51, 234, 0.15)' : card.bgGradient.includes('blue') ? 'rgba(59, 130, 246, 0.15)' : 'rgba(16, 185, 129, 0.15)'}, rgba(0, 0, 0, 0.7))`
                  }}
                >
                  {/* Simplified Glow Effect for Better Performance */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br from-${card.glowColor}/10 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none`}
                    animate={activeCard === card.id && !isMobile ? {
                      opacity: [0.1, 0.3, 0.1]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  />
                  
                  {/* Header Section */}
                  <div className="relative p-8 pb-6">
                    <motion.div 
                      className="flex items-start justify-between mb-6"
                      whileHover={{ x: 8 }}
                      transition={{ duration: 0.3, type: "spring" }}
                    >
                      <motion.div
                        className={`p-4 bg-gradient-to-br ${card.gradient} rounded-2xl shadow-xl relative overflow-hidden will-change-transform`}
                        whileHover={!isMobile ? { 
                          scale: 1.1,
                          rotate: [0, 5, -5, 0]
                        } : {}}
                        whileTap={isMobile ? {
                          scale: 1.05,
                          transition: { duration: 0.1 }
                        } : {}}
                        transition={{ duration: isMobile ? 0.2 : 0.6, type: "spring", stiffness: 200 }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                          animate={activeCard === card.id && !isMobile ? {
                            opacity: [0.1, 0.2, 0.1]
                          } : {}}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <IconComponent className="text-3xl text-white relative z-10" />
                      </motion.div>
                      
                      <motion.div
                        className="flex items-center gap-3 text-white/70 group-hover:text-white/90 transition-colors duration-300 bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm"
                        whileHover={{ scale: 1.1, x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="text-sm font-semibold">Explore</span>
                        <motion.div
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <FaArrowRight className="text-sm" />
                        </motion.div>
                      </motion.div>
                    </motion.div>
                    
                    <motion.h3 
                      className={`text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent tracking-wide leading-tight`}
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      {card.title}
                    </motion.h3>
                    
                    <motion.div 
                      className={`w-20 h-1.5 bg-gradient-to-r ${card.gradient} rounded-full group-hover:w-32 transition-all duration-700 mb-2`}
                      whileHover={{ width: '60%', height: 6 }}
                      transition={{ duration: 0.4, type: "spring" }}
                    />
                    
                    {/* Simplified Decorative elements */}
                    <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none">
                      <motion.div
                        className={`w-20 h-20 bg-gradient-to-br ${card.gradient} rounded-full blur-xl`}
                        animate={!isMobile ? {
                          scale: [1, 1.1, 1],
                          opacity: [0.1, 0.3, 0.1]
                        } : {}}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </div>
                  </div>
                  
                  {/* Content Section */}
                  <div className="relative p-8 pt-4 flex-1 flex flex-col">
                    <motion.p 
                      className="text-neutral-200 text-lg md:text-xl leading-relaxed mb-8 flex-1 font-medium"
                      initial={{ opacity: 0.9 }}
                      whileHover={{ opacity: 1 }}
                      style={{ lineHeight: '1.7' }}
                    >
                      {wrapWords(card.description)}
                    </motion.p>
                    
                    {/* Features List with Optimized Performance */}
                    <motion.div
                      className="space-y-4 bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10 group-hover:border-white/20 transition-all duration-200"
                      initial={{ opacity: 0, y: 20 }}
                      animate={isCardInView[index] ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ delay: isMobile ? index * 0.1 + 0.3 : index * 0.1 + 0.5, duration: 0.4 }}
                      whileHover={!isMobile ? { 
                        background: "rgba(255, 255, 255, 0.08)",
                        scale: 1.01
                      } : {}}
                    >
                      <h4 className="text-white/90 font-bold mb-4 text-lg tracking-wide">
                        Key Features
                      </h4>
                      {card.features.map((feature, featureIndex) => (
                        <motion.div
                          key={featureIndex}
                          className="flex items-center gap-4 text-base text-white/80 group-hover:text-white/95 transition-colors duration-300 p-3 rounded-xl hover:bg-white/5"
                          whileHover={{ x: 12, scale: 1.02 }}
                          transition={{ duration: 0.3, type: "spring" }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          style={{ transitionDelay: `${featureIndex * 100}ms` }}
                        >
                          <motion.div
                            className={`w-3 h-3 bg-gradient-to-r ${card.gradient} rounded-full shadow-lg flex-shrink-0`}
                            animate={activeCard === card.id ? {
                              scale: [1, 1.4, 1],
                              opacity: [1, 0.8, 1],
                              boxShadow: [
                                "0 0 0 rgba(147, 51, 234, 0)",
                                "0 0 20px rgba(147, 51, 234, 0.6)",
                                "0 0 0 rgba(147, 51, 234, 0)"
                              ]
                            } : {}}
                            transition={{ duration: 2, repeat: Infinity, delay: featureIndex * 0.3 }}
                            whileHover={{
                              scale: 1.5,
                              boxShadow: "0 0 15px rgba(147, 51, 234, 0.8)"
                            }}
                          />
                          <span className="font-semibold text-lg tracking-wide">{feature}</span>
                          <motion.div
                            className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            whileHover={{ x: 3 }}
                          >
                            <FaArrowRight className="text-sm text-white/60" />
                          </motion.div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                  
                  {/* Interactive Elements */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    animate={activeCard === card.id ? {
                      background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1), transparent 40%)`
                    } : {}}
                    transition={{ duration: 0.3 }}
                  />
                  
                  {/* Bottom Accent */}
                  <motion.div
                    className={`absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r ${card.gradient} opacity-60 group-hover:opacity-100 transition-all duration-500 rounded-b-3xl`}
                    whileHover={{ height: 8 }}
                    animate={activeCard === card.id ? {
                      height: [2, 6, 2],
                      opacity: [0.6, 1, 0.6]
                    } : {}}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  
                  {/* Corner decorative elements */}
                  <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-white/20 rounded-tl-xl group-hover:border-white/40 transition-colors duration-300" />
                  <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-white/20 rounded-tr-xl group-hover:border-white/40 transition-colors duration-300" />
                  <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-white/20 rounded-bl-xl group-hover:border-white/40 transition-colors duration-300" />
                  <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-white/20 rounded-br-xl group-hover:border-white/40 transition-colors duration-300" />
                </motion.div>
              </motion.div>
            )
          })}
        </div>
        
        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="w-full text-center mt-24 mb-16 relative"
        >
          {/* Theme section teaser */}
          <motion.div 
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                THEMES
              </span>
            </h3>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              Explore cutting-edge themes that will challenge your creativity and push the boundaries of innovation
            </p>
          </motion.div>
          
          {/* Enhanced CTA Button */}
          <motion.div
            className="inline-flex items-center gap-6 px-12 py-6 bg-gradient-to-r from-purple-600/25 via-blue-600/25 to-green-600/25 rounded-full border-2 border-white/40 backdrop-blur-md cursor-pointer group relative overflow-hidden shadow-2xl"
            whileHover={{ 
              scale: 1.08, 
              y: -8,
              boxShadow: "0 25px 50px rgba(147, 51, 234, 0.4)",
              borderColor: "rgba(255, 255, 255, 0.6)"
            }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 300 }}
          >
            {/* Animated background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-green-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              animate={{
                background: [
                  "linear-gradient(45deg, rgba(147, 51, 234, 0.3), rgba(59, 130, 246, 0.3), rgba(16, 185, 129, 0.3))",
                  "linear-gradient(90deg, rgba(59, 130, 246, 0.3), rgba(16, 185, 129, 0.3), rgba(147, 51, 234, 0.3))",
                  "linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(147, 51, 234, 0.3), rgba(59, 130, 246, 0.3))"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <FaRocket className="text-2xl text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
            </motion.div>
            
            <span className="text-xl md:text-2xl bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent font-bold group-hover:from-purple-300 group-hover:via-blue-300 group-hover:to-green-300 transition-all duration-500 relative z-10">
              Ready to Transform Ideas into Reality?
            </span>
            
            <motion.div
              animate={{ x: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="relative z-10"
            >
              <FaArrowRight className="text-xl text-white group-hover:text-green-300 transition-colors duration-300" />
            </motion.div>
          </motion.div>
          
          {/* Additional info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.2 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-neutral-500"
          >
            <div className="flex items-center gap-2">
              <FaStar className="text-yellow-400" />
              <span>48 Hours of Innovation</span>
            </div>
            <div className="flex items-center gap-2">
              <FaUsers className="text-blue-400" />
              <span>Global Collaboration</span>
            </div>
            <div className="flex items-center gap-2">
              <FaLightbulb className="text-green-400" />
              <span>Unlimited Possibilities</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default About
