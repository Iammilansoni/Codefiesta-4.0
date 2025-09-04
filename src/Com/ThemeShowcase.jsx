import React, { useState } from 'react'
// eslint-disable-next-line no-unused-vars -- motion is used as JSX elements throughout the component
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FaCode, 
  FaRobot, 
  FaShieldAlt, 
  FaLeaf, 
  FaHeartbeat, 
  FaGraduationCap,
  FaGamepad,
  FaMobile,
  FaChevronRight,
  FaStar,
  FaLightbulb
} from 'react-icons/fa'

const ThemeShowcase = () => {
  const [activeTheme, setActiveTheme] = useState(0)

  const themes = [
    {
      id: 1,
      title: "AI & Machine Learning",
      icon: FaRobot,
      gradient: "from-purple-500 via-pink-500 to-red-500",
      bgGradient: "from-purple-500/10 to-pink-500/10",
      description: "Build intelligent solutions using cutting-edge AI technologies, machine learning algorithms, and neural networks.",
      technologies: ["TensorFlow", "PyTorch", "OpenAI", "Computer Vision", "NLP"],
      challenges: ["Predictive Analytics", "Chatbots", "Image Recognition", "Recommendation Systems"]
    },
    {
      id: 2,
      title: "Web Development",
      icon: FaCode,
      gradient: "from-blue-500 via-cyan-500 to-teal-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      description: "Create stunning web applications with modern frameworks, responsive design, and seamless user experiences.",
      technologies: ["React", "Vue", "Angular", "Node.js", "GraphQL"],
      challenges: ["Progressive Web Apps", "E-commerce", "Social Platforms", "Developer Tools"]
    },
    {
      id: 3,
      title: "Cybersecurity",
      icon: FaShieldAlt,
      gradient: "from-red-500 via-orange-500 to-yellow-500",
      bgGradient: "from-red-500/10 to-orange-500/10",
      description: "Develop secure systems, encryption tools, and cybersecurity solutions to protect digital assets.",
      technologies: ["Blockchain", "Encryption", "Penetration Testing", "Zero Trust", "IAM"],
      challenges: ["Threat Detection", "Secure Communications", "Identity Management", "Vulnerability Scanner"]
    },
    {
      id: 4,
      title: "Sustainability",
      icon: FaLeaf,
      gradient: "from-green-500 via-emerald-500 to-teal-500",
      bgGradient: "from-green-500/10 to-emerald-500/10",
      description: "Create eco-friendly solutions that address climate change, renewable energy, and environmental challenges.",
      technologies: ["IoT Sensors", "Data Analytics", "Solar Tech", "Carbon Tracking", "Smart Grids"],
      challenges: ["Carbon Footprint Tracker", "Smart Energy", "Waste Management", "Climate Monitoring"]
    },
    {
      id: 5,
      title: "Healthcare",
      icon: FaHeartbeat,
      gradient: "from-pink-500 via-rose-500 to-red-500",
      bgGradient: "from-pink-500/10 to-rose-500/10",
      description: "Innovate healthcare solutions using telemedicine, wearables, and health monitoring technologies.",
      technologies: ["Wearable Tech", "Telemedicine", "Health APIs", "Medical AI", "Biotech"],
      challenges: ["Health Monitoring", "Mental Health Apps", "Drug Discovery", "Fitness Tracking"]
    },
    {
      id: 6,
      title: "EdTech",
      icon: FaGraduationCap,
      gradient: "from-indigo-500 via-purple-500 to-pink-500",
      bgGradient: "from-indigo-500/10 to-purple-500/10",
      description: "Transform education with interactive learning platforms, VR/AR experiences, and personalized learning.",
      technologies: ["VR/AR", "LMS", "Adaptive Learning", "Gamification", "EdTech APIs"],
      challenges: ["Virtual Classrooms", "Skill Assessment", "Language Learning", "STEM Education"]
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }
    }
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden py-20">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-green-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full border border-white/20 backdrop-blur-sm"
            whileHover={{ scale: 1.05, y: -5 }}
          >
            <FaLightbulb className="text-2xl text-yellow-400 animate-pulse" />
            <span className="text-xl font-bold text-white">Innovation Themes</span>
            <FaStar className="text-2xl text-blue-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </motion.div>
          
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent mb-6 font-loadfont">
            Choose Your Battleground
          </h2>
          
          <p className="text-xl text-neutral-400 max-w-3xl mx-auto leading-relaxed">
            Dive into cutting-edge themes that will challenge your creativity and shape the future of technology
          </p>
        </motion.div>

        {/* Theme Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {themes.map((theme, index) => {
            const IconComponent = theme.icon
            const isActive = activeTheme === index
            
            return (
              <motion.div
                key={theme.id}
                variants={cardVariants}
                className={`group relative h-full cursor-pointer transform-gpu ${
                  isActive ? 'z-10' : 'z-0'
                }`}
                onHoverStart={() => setActiveTheme(index)}
                whileHover={{ 
                  scale: 1.02,
                  y: -10,
                  transition: { duration: 0.2 }
                }}
              >
                <div className={`
                  relative h-full bg-gradient-to-br ${theme.bgGradient} backdrop-blur-lg
                  border border-white/10 rounded-2xl p-8 overflow-hidden
                  transition-all duration-500
                  ${isActive ? 'border-white/30 shadow-2xl' : 'hover:border-white/20'}
                `}>
                  {/* Glow Effect */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    animate={isActive ? {
                      opacity: [0.05, 0.15, 0.05],
                    } : {}}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  
                  {/* Header */}
                  <div className="relative z-10 mb-6">
                    <motion.div 
                      className={`inline-flex p-4 bg-gradient-to-br ${theme.gradient} rounded-xl mb-4 shadow-lg`}
                      whileHover={{ 
                        rotate: 360,
                        scale: 1.1
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <IconComponent className="text-2xl text-white" />
                    </motion.div>
                    
                    <h3 className={`text-2xl font-bold mb-3 bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>
                      {theme.title}
                    </h3>
                    
                    <p className="text-neutral-300 text-base leading-relaxed mb-6">
                      {theme.description}
                    </p>
                  </div>
                  
                  {/* Technologies */}
                  <div className="relative z-10 mb-6">
                    <h4 className="text-white/80 font-semibold mb-3 text-sm uppercase tracking-wide">
                      Technologies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {theme.technologies.map((tech, techIndex) => (
                        <motion.span
                          key={tech}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: techIndex * 0.1 + index * 0.2 }}
                          className="px-3 py-1 bg-white/10 rounded-full text-xs text-white/80 backdrop-blur-sm border border-white/20"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Challenges */}
                  <div className="relative z-10">
                    <h4 className="text-white/80 font-semibold mb-3 text-sm uppercase tracking-wide">
                      Challenge Ideas
                    </h4>
                    <ul className="space-y-2">
                      {theme.challenges.map((challenge, challengeIndex) => (
                        <motion.li
                          key={challenge}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: challengeIndex * 0.1 + index * 0.1 }}
                          className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors duration-300"
                        >
                          <motion.div
                            className={`w-1.5 h-1.5 bg-gradient-to-r ${theme.gradient} rounded-full`}
                            animate={isActive ? {
                              scale: [1, 1.5, 1],
                              opacity: [1, 0.7, 1]
                            } : {}}
                            transition={{ duration: 2, repeat: Infinity, delay: challengeIndex * 0.3 }}
                          />
                          <span>{challenge}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* Hover Arrow */}
                  <motion.div
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ x: 5 }}
                  >
                    <FaChevronRight className="text-white/60" />
                  </motion.div>
                  
                  {/* Bottom Accent */}
                  <motion.div
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${theme.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500`}
                    whileHover={{ height: 4 }}
                  />
                </div>
              </motion.div>
            )
          })}
        </motion.div>
        
        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-neutral-400 mb-8">
            Can't decide? Mix and match themes to create something truly unique!
          </p>
          
          <motion.button
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(147, 51, 234, 0.3)"
            }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <span>Start Building</span>
            <FaChevronRight />
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

export default ThemeShowcase
