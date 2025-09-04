import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for intersection-based lazy loading
 * @param {Object} options - Intersection observer options
 * @param {string} options.rootMargin - Root margin for intersection observer
 * @param {number} options.threshold - Threshold for intersection observer
 * @param {boolean} options.once - Whether to observe only once
 * @param {number} options.delay - Delay before triggering load
 * @returns {Array} [ref, isIntersecting, isLoaded]
 */
export const useIntersectionLoader = (options = {}) => {
  const {
    rootMargin = '50px',
    threshold = 0.1,
    once = true,
    delay = 0
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          
          if (delay > 0) {
            timeoutRef.current = setTimeout(() => {
              setIsLoaded(true);
            }, delay);
          } else {
            setIsLoaded(true);
          }

          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsIntersecting(false);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
        }
      },
      {
        rootMargin,
        threshold
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [rootMargin, threshold, once, delay]);

  return [ref, isIntersecting, isLoaded];
};

/**
 * Hook for progressive loading of content sections
 * @param {number} staggerDelay - Delay between each item load
 * @param {number} itemCount - Number of items to load
 * @returns {Array} [ref, loadedItems]
 */
export const useProgressiveLoader = (staggerDelay = 100, itemCount = 0) => {
  const [ref, isIntersecting] = useIntersectionLoader({ 
    rootMargin: '100px',
    threshold: 0.1 
  });
  const [loadedItems, setLoadedItems] = useState(0);

  useEffect(() => {
    if (!isIntersecting || itemCount === 0) return;

    let timeouts = [];
    
    for (let i = 0; i < itemCount; i++) {
      const timeout = setTimeout(() => {
        setLoadedItems(prev => Math.min(prev + 1, itemCount));
      }, i * staggerDelay);
      
      timeouts.push(timeout);
    }

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [isIntersecting, staggerDelay, itemCount]);

  return [ref, loadedItems];
};

/**
 * Hook for batched intersection loading
 * @param {Array} items - Array of items to load
 * @param {Object} options - Loading options
 * @returns {Array} [ref, loadedBatches, isComplete]
 */
export const useBatchedLoader = (items = [], options = {}) => {
  const {
    batchSize = 2,
    batchDelay = 200,
    rootMargin = '50px'
  } = options;

  const [ref, isIntersecting] = useIntersectionLoader({ 
    rootMargin,
    once: true 
  });
  const [loadedBatches, setLoadedBatches] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const totalBatches = Math.ceil(items.length / batchSize);

  useEffect(() => {
    if (!isIntersecting || items.length === 0) return;

    let currentBatch = 0;
    const loadNextBatch = () => {
      if (currentBatch < totalBatches) {
        setLoadedBatches(prev => prev + 1);
        currentBatch++;
        
        if (currentBatch < totalBatches) {
          setTimeout(loadNextBatch, batchDelay);
        } else {
          setIsComplete(true);
        }
      }
    };

    loadNextBatch();
  }, [isIntersecting, items.length, totalBatches, batchDelay]);

  const getVisibleItems = useCallback(() => {
    const visibleCount = loadedBatches * batchSize;
    return items.slice(0, visibleCount);
  }, [items, loadedBatches, batchSize]);

  return [ref, getVisibleItems(), isComplete, loadedBatches];
};

export default useIntersectionLoader;
