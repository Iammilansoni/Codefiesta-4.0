import React, { Suspense, useRef, lazy, useEffect, memo } from "react";
import { LazyMotion, domAnimation } from "framer-motion";
import Loading from "./Com/Loading";
import Forntpage from "./Com/Forntpage";
import PerformancePanel from "./components/PerformancePanel";
import MouseFollowHighlight from "./components/MouseFollowHighlight";
import ProgressiveSection from "./components/ProgressiveSection";
import { initializeOptimizations } from "./utils/globalOptimizations";

// Optimized lazy loading with better chunk names
const About = lazy(() => 
  import(/* webpackChunkName: "about-section" */ "./Com/About")
);
const Timeline = lazy(() => 
  import(/* webpackChunkName: "timeline-section" */ "./Com/Timeline")
);
const Star = lazy(() => 
  import(/* webpackChunkName: "themes-section" */ "./Com/StarFallback")
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

// Ultra-fast loading component
const SectionLoader = memo(({ title }) => (
  <div className="h-screen w-full bg-black flex items-center justify-center">
    <div className="flex flex-col items-center gap-2">
      <div className="w-6 h-6 border border-white border-t-transparent rounded-full animate-spin"></div>
      <div className="text-white text-sm opacity-75">Loading {title}</div>
    </div>
  </div>
));

SectionLoader.displayName = 'SectionLoader';

// Optimized section wrapper
const SectionWrapper = memo(({ children, title, priority = false }) => {
  return (
    <ProgressiveSection
      priority={priority}
      loadingTitle={`Loading ${title}...`}
      rootMargin={priority ? "500px" : "150px"}
      fallback={() => <SectionLoader title={title} />}
      enableTransition={!priority}
    >
      <div style={{ contain: 'layout style paint' }}>
        {children}
      </div>
    </ProgressiveSection>
  );
});

SectionWrapper.displayName = 'SectionWrapper';

const App = () => {
  // Refs for sections
  const aboutRef = useRef(null);
  const themesRef = useRef(null);
  const timelineRef = useRef(null);
  const prizesRef = useRef(null);
  const mentorTitleRef = useRef(null);
  const mentorsRef = useRef(null);
  const teamRef = useRef(null);

  // Initialize optimizations and aggressive preloading
  useEffect(() => {
    initializeOptimizations();
    
    // Aggressive preloading - Start immediately
    const preloadComponents = async () => {
      try {
        // Preload critical components first (high priority)
        await Promise.all([
          import("./Com/About"),
          import("./Com/Timeline")
        ]);
        
        // Then preload remaining components
        setTimeout(() => {
          Promise.all([
            import("./Com/StarFallback"),
            import("./Com/PrizesRewardsPage"),
            import("./Com/MentorTitle"),
            import("./Com/Glimespage"),
            import("./Com/Teams")
          ]);
        }, 500);
      } catch (error) {
        console.warn('Component preloading failed:', error);
      }
    };

    // Start preloading immediately
    const timeoutId = setTimeout(preloadComponents, 50);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      {/* Mouse Follow Highlight Effect */}
      <MouseFollowHighlight />
      
      {/* Performance monitoring in development */}
      {import.meta.env.DEV && <PerformancePanel />}
      
      <div className="relative h-screen w-full flex-col flex overflow-hidden">
        {/* Main frontpage section - Always loaded immediately */}
        <div className="w-full h-screen bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
          <Suspense fallback={<Loading />}>
            <Forntpage />
          </Suspense>
        </div>
      </div>
      
      {/* Scrollable content sections with progressive loading */}
      <div className="relative w-full">
        {/* About Section - High priority */}
        <SectionWrapper title="About" priority={true}>
          <div ref={aboutRef}>
            <Suspense fallback={<SectionLoader title="About" />}>
              <About />
            </Suspense>
          </div>
        </SectionWrapper>
        
        {/* Themes/Star Section */}
        <SectionWrapper title="Themes">
          <div ref={themesRef} className="star-section relative h-[200vh]">
            <div className="sticky top-0 h-screen overflow-hidden">
              <Suspense fallback={<SectionLoader title="Themes" />}>
                <Star />
              </Suspense>
            </div>
          </div>
        </SectionWrapper>
        
        {/* Timeline Section */}
        <SectionWrapper title="Timeline">
          <div ref={timelineRef}>
            <Suspense fallback={<SectionLoader title="Timeline" />}>
              <Timeline />
            </Suspense>
          </div>
        </SectionWrapper>
        
        {/* Prizes Section */}
        <SectionWrapper title="Prizes">
          <div ref={prizesRef}>
            <Suspense fallback={<SectionLoader title="Prizes" />}>
              <PrizesRewardsPage />
            </Suspense>
          </div>
        </SectionWrapper>
        
        {/* Mentor Title Section */}
        <SectionWrapper title="Mentors">
          <div ref={mentorTitleRef}>
            <Suspense fallback={<SectionLoader title="Mentor Info" />}>
              <MentorTitle />
            </Suspense>
          </div>
        </SectionWrapper>
        
        {/* Mentors Section */}
        <SectionWrapper title="Mentor Profiles">
          <div ref={mentorsRef}>
            <Suspense fallback={<SectionLoader title="Mentor Profiles" />}>
              <Glimespage />
            </Suspense>
          </div>
        </SectionWrapper>
        
        {/* Teams Section */}
        <SectionWrapper title="Our Team">
          <div ref={teamRef}>
            <Suspense fallback={<SectionLoader title="Team Members" />}>
              <Teams />
            </Suspense>
          </div>
        </SectionWrapper>
      </div>
    </LazyMotion>
  );
};

export default App;






// {window.innerWidth <= 956 ? (
//         // ---------- Desktop Navbar ----------
//         <div className="h-[50px] pr-2 md:w-fit  bg-red  overflow-hidden rounded-[30vh]
//             backdrop-blur-xl bg-[#00000017]
//             border border-white/30 shadow-[0_4px_20px_rgba(0,0,0,0.4)]
//             fixed top-3 left-1/2 -translate-x-1/2
//             z-[9999] pointer-events-auto flex items-center justify-between">

        
//           <div 
          

//           className="h-full  flex      justify-between      px-2 p-1">
//             {menuItems.map((item, index) => (
//               <div
//                 key={index}

//                 onClick={() => scrollToRef(item.ref)}
                
//                 className="h-full bg flex items-center justify-center  font-loadfont
//                   text-[14px] font-semibold w-28 text-white rounded-[29px] cursor-pointer
//                   transition-all duration-300 ease-in-out
//                   hover:bg-gradient-to-r from-pink-500 to-[#6b4beb]
//                   hover:text-black hover:scale-105 hover:shadow-[0_0_15px_rgba(255,0,128,0.7)]"
//               >
//                 {item.name}
//               </div>
//             ))}
//           </div>

//           {/* Register Now Button */}
//           <div className="h-full   -mr-1    w-[30vh]   py-1  flex items-center justify-center">
//             <motion.div
//               className="h-full w-full   shrink-0 font-loadfont rounded-[20px] font-semibold text-[17px]
//                 flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg cursor-pointer"
//               animate={{
//                 boxShadow: [
//                   "0 0 10px rgba(128,90,213,0.5)",
//                   "0 0 20px rgba(128,90,213,0.8)",
//                   "0 0 10px rgba(128,90,213,0.5)",
//                 ],
//               }}
//               transition={{
//                 duration: 2,
//                 repeat: Infinity,
//                 repeatType: "loop",
//                 ease: "easeInOut",
//               }}
//             >
//               Register Now
//             </motion.div>
//           </div>
//         </div>



//       ) :
//         (


          

//         )}