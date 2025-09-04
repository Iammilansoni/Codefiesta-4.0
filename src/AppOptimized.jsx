import React, { Suspense, useRef, lazy, useEffect, memo, useState } from "react";
import { motion, LazyMotion, domAnimation } from "framer-motion";
import Loading from "./Com/Loading";
import Forntpage from "./Com/Forntpage";
import PerformancePanel from "./components/PerformancePanel";
import MouseFollowHighlight from "./components/MouseFollowHighlight";
import ProgressiveSection from "./components/ProgressiveSection";
import { initializeOptimizations } from "./utils/globalOptimizations";

// Optimized lazy loading with better chunk names and prefetch hints
const About = lazy(() => 
  import(/* webpackChunkName: "about-section" */ "./Com/About").then(module => ({ 
    default: module.default 
  }))
);

const Timeline = lazy(() => 
  import(/* webpackChunkName: "timeline-section" */ "./Com/Timeline")
);

const Star = lazy(() => 
  import(/* webpackChunkName: "themes-section" */ "./Com/Star")
);

const Teams = lazy(() => 
  import(/* webpackChunkName: "teams-section" */ "./Com/Teams")
);

const PrizesRewardsPage = lazy(() => 
  import(/* webpackChunkName: "prizes-section" */ "./Com/PrizesRewardsPage")
);

const MentorTitle = lazy(() => 
  import(/* webpackChunkName: "mentor-title-section" */ "./Com/MentorTitle")
);

const Glimespage = lazy(() => 
  import(/* webpackChunkName: "mentors-section" */ "./Com/Glimespage")
);

// Ultra-fast loading component with minimal overhead
const OptimizedSectionLoader = memo(({ title, progress = 0 }) => (
  <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-black to-purple-900/20 flex items-center justify-center">
    <div className="flex flex-col items-center gap-4 max-w-sm w-full px-8">
      <div className="relative">
        <div className="w-12 h-12 border-2 border-purple-500/30 rounded-full"></div>
        <div className="absolute inset-0 w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      
      <div className="text-center">
        <h3 className="text-white text-lg font-medium mb-2">{title}</h3>
        <div className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full origin-left"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress / 100 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <p className="text-gray-400 text-sm mt-2">Loading {progress}%</p>
      </div>
    </div>
  </div>
));

OptimizedSectionLoader.displayName = 'OptimizedSectionLoader';

// Optimized section wrapper
const SectionWrapper = memo(({ children, sectionId, title, priority = false }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    if (priority) return;
    
    // Simulate loading progress for better UX
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [priority]);

  return (
    <ProgressiveSection
      priority={priority}
      loadingTitle={`Loading ${title}...`}
      rootMargin={priority ? "500px" : "200px"}
      fallback={() => <OptimizedSectionLoader title={title} progress={loadingProgress} />}
      enableTransition={!priority}
    >
      <div id={sectionId} style={{ contain: 'layout style paint' }}>
        {children}
      </div>
    </ProgressiveSection>
  );
});

SectionWrapper.displayName = 'SectionWrapper';

const OptimizedApp = () => {
  // Refs for sections (keeping for any navigation logic)
  const aboutRef = useRef(null);
  const themesRef = useRef(null);
  const timelineRef = useRef(null);
  const prizesRef = useRef(null);
  const mentorTitleRef = useRef(null);
  const mentorsRef = useRef(null);
  const teamRef = useRef(null);

  // Initialize global optimizations
  useEffect(() => {
    initializeOptimizations();
    
    // Preload next sections after initial load
    const preloadTimer = setTimeout(() => {
      // Start preloading critical sections
      import("./Com/About");
      import("./Com/Timeline");
    }, 1000);

    return () => clearTimeout(preloadTimer);
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      {/* Mouse Follow Highlight Effect */}
      <MouseFollowHighlight />
      
      {/* Performance monitoring in development */}
      {import.meta.env.DEV && <PerformancePanel />}
      
      {/* Hero Section - Always loaded immediately */}
      <div className="relative h-screen w-full flex-col flex overflow-hidden">
        <div className="w-full h-screen bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
          <Suspense fallback={<Loading />}>
            <Forntpage />
          </Suspense>
        </div>
      </div>
      
      {/* Progressive Sections Container */}
      <div className="relative w-full">
        {/* About Section - High priority */}
        <SectionWrapper 
          sectionId="about" 
          title="About Section" 
          priority={true}
        >
          <div ref={aboutRef}>
            <Suspense fallback={<OptimizedSectionLoader title="About" progress={25} />}>
              <About />
            </Suspense>
          </div>
        </SectionWrapper>
        
        {/* Themes/Star Section */}
        <SectionWrapper 
          sectionId="themes" 
          title="Themes"
        >
          <div ref={themesRef} className="star-section relative h-[200vh]">
            <div className="sticky top-0 h-screen overflow-hidden">
              <Suspense fallback={<OptimizedSectionLoader title="Themes" progress={40} />}>
                <Star />
              </Suspense>
            </div>
          </div>
        </SectionWrapper>
        
        {/* Timeline Section */}
        <SectionWrapper 
          sectionId="timeline" 
          title="Timeline"
        >
          <div ref={timelineRef}>
            <Suspense fallback={<OptimizedSectionLoader title="Timeline" progress={55} />}>
              <Timeline />
            </Suspense>
          </div>
        </SectionWrapper>
        
        {/* Prizes Section */}
        <SectionWrapper 
          sectionId="prizes" 
          title="Prizes & Rewards"
        >
          <div ref={prizesRef}>
            <Suspense fallback={<OptimizedSectionLoader title="Prizes" progress={70} />}>
              <PrizesRewardsPage />
            </Suspense>
          </div>
        </SectionWrapper>
        
        {/* Mentor Title Section */}
        <SectionWrapper 
          sectionId="mentor-title" 
          title="Mentors"
        >
          <div ref={mentorTitleRef}>
            <Suspense fallback={<OptimizedSectionLoader title="Mentor Info" progress={80} />}>
              <MentorTitle />
            </Suspense>
          </div>
        </SectionWrapper>
        
        {/* Mentors Section */}
        <SectionWrapper 
          sectionId="mentors" 
          title="Meet Our Mentors"
        >
          <div ref={mentorsRef}>
            <Suspense fallback={<OptimizedSectionLoader title="Mentor Profiles" progress={90} />}>
              <Glimespage />
            </Suspense>
          </div>
        </SectionWrapper>
        
        {/* Teams Section */}
        <SectionWrapper 
          sectionId="teams" 
          title="Our Team"
        >
          <div ref={teamRef}>
            <Suspense fallback={<OptimizedSectionLoader title="Team Members" progress={95} />}>
              <Teams />
            </Suspense>
          </div>
        </SectionWrapper>
      </div>
    </LazyMotion>
  );
};

export default OptimizedApp;
