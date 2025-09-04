import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBars, FaTimes, FaHome, FaInfoCircle, FaClock, FaGift, FaUsers, FaLightbulb } from 'react-icons/fa'

const Navigation = ({ refs }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const menuItems = [
    { name: 'Home', icon: FaHome, ref: refs?.homeRef },
    { name: 'About', icon: FaInfoCircle, ref: refs?.aboutRef },
    { name: 'Themes', icon: FaLightbulb, ref: refs?.themesRef },
    { name: 'Timeline', icon: FaClock, ref: refs?.timelineRef },
    { name: 'Prizes', icon: FaGift, ref: refs?.prizesRef },
    { name: 'Team', icon: FaUsers, ref: refs?.teamRef }
  ]

  const scrollToSection = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' })
      setIsOpen(false)
    }
  }

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] hidden md:block transition-all duration-500 ${
          scrolled ? 'top-2' : 'top-4'
        }`}
      >
        <div className={`glass-morphism-strong rounded-full px-8 py-4 transition-all duration-500 ${
          scrolled ? 'scale-95 bg-black/20' : 'scale-100'
        }`}>
          <ul className="flex items-center gap-8">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon
              return (
                <motion.li
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
                >
                  <button
                    onClick={() => scrollToSection(item.ref)}
                    className="relative flex items-center gap-2 px-4 py-2 text-white/80 hover:text-white transition-all duration-300 group"
                  >
                    <IconComponent className="text-lg group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium font-loadfont group-hover:text-purple-300 transition-colors duration-300">
                      {item.name}
                    </span>
                    
                    {/* Hover effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ scale: 1.05 }}
                    />
                  </button>
                </motion.li>
              )
            })}
          </ul>
        </div>
      </motion.nav>

      {/* Mobile Navigation Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-[9999] md:hidden glass-morphism-strong p-4 rounded-full text-white hover:text-purple-300 transition-all duration-300"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
        </motion.div>
      </motion.button>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] md:hidden"
            />
            
            {/* Mobile Menu */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[80vw] glass-morphism-strong z-[9999] md:hidden"
            >
              <div className="p-8 pt-20">
                <motion.h2
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-8 font-loadfont"
                >
                  Navigation
                </motion.h2>
                
                <ul className="space-y-4">
                  {menuItems.map((item, index) => {
                    const IconComponent = item.icon
                    return (
                      <motion.li
                        key={item.name}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 + 0.1 }}
                      >
                        <button
                          onClick={() => scrollToSection(item.ref)}
                          className="w-full flex items-center gap-4 p-4 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 group"
                        >
                          <IconComponent className="text-xl group-hover:text-purple-300 group-hover:scale-110 transition-all duration-300" />
                          <span className="font-medium font-loadfont text-lg group-hover:text-purple-300 transition-colors duration-300">
                            {item.name}
                          </span>
                          <motion.div
                            initial={{ width: 0 }}
                            whileHover={{ width: 20 }}
                            className="ml-auto h-px bg-gradient-to-r from-purple-400 to-blue-400"
                          />
                        </button>
                      </motion.li>
                    )
                  })}
                </ul>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navigation
