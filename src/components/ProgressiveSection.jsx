import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntersectionLoader } from '../hooks/useIntersectionLoader';

/**
 * Progressive Section Component - Loads content only when needed
 * Reduces initial bundle size and improves performance
 */
const ProgressiveSection = memo(({ 
  children, 
  fallback,
  rootMargin = '200px',
  threshold = 0.1,
  priority = false,
  className = '',
  loadingTitle = 'Loading...',
  minHeight = 'min-h-screen',
  enableTransition = true
}) => {
  const [ref, isIntersecting] = useIntersectionLoader({
    rootMargin: priority ? '500px' : rootMargin,
    threshold,
    once: true,
    delay: priority ? 0 : 100
  });

  const [contentReady, setContentReady] = useState(priority);
  const contentRef = useRef(null);

  // Mark content as ready when intersection occurs
  useEffect(() => {
    if (isIntersecting || priority) {
      setContentReady(true);
    }
  }, [isIntersecting, priority]);

  // Default fallback component
  const DefaultFallback = useCallback(() => (
    <div className={`${minHeight} w-full bg-gradient-to-br from-gray-900 via-black to-purple-900/20 flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center gap-4 text-white">
        <div className="relative">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-8 h-8 border border-purple-300 rounded-full opacity-30"></div>
        </div>
        <span className="text-sm font-medium opacity-75">{loadingTitle}</span>
        <div className="w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </div>
  ), [minHeight, className, loadingTitle]);

  const FallbackComponent = fallback || DefaultFallback;

  return (
    <div ref={ref} className={className}>
      <AnimatePresence mode="wait">
        {contentReady ? (
          <motion.div
            key="content"
            ref={contentRef}
            initial={enableTransition ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        ) : (
          <motion.div
            key="fallback"
            initial={enableTransition ? { opacity: 0 } : false}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FallbackComponent />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

ProgressiveSection.displayName = 'ProgressiveSection';

/**
 * Optimized Section Wrapper - Combines progressive loading with performance optimizations
 */
export const OptimizedSection = memo((props) => {
  const { 
    component: ComponentToRender, 
    componentProps = {},
    sectionProps = {},
    ...progressiveProps 
  } = props;
  
  const [isContentLoaded, setIsContentLoaded] = useState(false);

  const handleContentLoad = useCallback(() => {
    setIsContentLoaded(true);
  }, []);

  return (
    <ProgressiveSection {...progressiveProps} {...sectionProps}>
      <div 
        className="w-full"
        style={{ 
          willChange: isContentLoaded ? 'auto' : 'transform',
          contain: 'layout style paint'
        }}
      >
        <ComponentToRender 
          {...componentProps} 
          onLoad={handleContentLoad}
          isVisible={true}
        />
      </div>
    </ProgressiveSection>
  );
});

OptimizedSection.displayName = 'OptimizedSection';

/**
 * Batched Section Loader - Loads multiple sections in batches
 */
export const BatchedSectionLoader = memo(({ 
  sections = [], 
  batchSize = 2, 
  batchDelay = 300,
  className = ''
}) => {
  const [loadedCount, setLoadedCount] = useState(0);
  const [ref, isIntersecting] = useIntersectionLoader({
    rootMargin: '300px',
    threshold: 0.1,
    once: true
  });

  useEffect(() => {
    if (!isIntersecting) return;

    const loadBatch = (batchIndex) => {
      setTimeout(() => {
        setLoadedCount(prev => Math.min(prev + batchSize, sections.length));
      }, batchIndex * batchDelay);
    };

    const totalBatches = Math.ceil(sections.length / batchSize);
    for (let i = 0; i < totalBatches; i++) {
      loadBatch(i);
    }
  }, [isIntersecting, batchSize, batchDelay, sections.length]);

  return (
    <div ref={ref} className={className}>
      {sections.slice(0, loadedCount).map((section, index) => (
        <motion.div
          key={section.key || index}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: (index % batchSize) * 0.1,
            ease: "easeOut"
          }}
        >
          {section.component}
        </motion.div>
      ))}
    </div>
  );
});

BatchedSectionLoader.displayName = 'BatchedSectionLoader';

export default ProgressiveSection;
