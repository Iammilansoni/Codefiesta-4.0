// Preloader utilities for better performance
export class ResourcePreloader {
  constructor() {
    this.loadedResources = new Map();
    this.loadingPromises = new Map();
  }

  // Preload images with priority
  async preloadImage(src, priority = 'low') {
    if (this.loadedResources.has(src)) {
      return this.loadedResources.get(src);
    }

    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src);
    }

    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.loadedResources.set(src, img);
        resolve(img);
      };
      img.onerror = reject;
      
      // Set loading priority for modern browsers
      if (priority === 'high') {
        img.fetchPriority = 'high';
      }
      
      img.src = src;
    });

    this.loadingPromises.set(src, promise);
    return promise;
  }

  // Preload multiple images in batches
  async preloadImages(imageSources, batchSize = 3) {
    const batches = [];
    for (let i = 0; i < imageSources.length; i += batchSize) {
      batches.push(imageSources.slice(i, i + batchSize));
    }

    const results = [];
    for (const batch of batches) {
      const batchPromises = batch.map(src => 
        typeof src === 'string' 
          ? this.preloadImage(src)
          : this.preloadImage(src.src, src.priority)
      );
      const batchResults = await Promise.allSettled(batchPromises);
      results.push(...batchResults);
    }

    return results;
  }

  // Preload fonts
  async preloadFont(fontFamily, url, descriptors = {}) {
    if (this.loadedResources.has(url)) {
      return this.loadedResources.get(url);
    }

    try {
      const font = new FontFace(fontFamily, `url(${url})`, descriptors);
      const loadedFont = await font.load();
      document.fonts.add(loadedFont);
      this.loadedResources.set(url, loadedFont);
      return loadedFont;
    } catch (error) {
      console.warn('Failed to preload font:', fontFamily, error);
      return null;
    }
  }

  // Check if resource is loaded
  isLoaded(src) {
    return this.loadedResources.has(src);
  }

  // Get loading progress
  getProgress(sources) {
    const loaded = sources.filter(src => this.isLoaded(src)).length;
    return loaded / sources.length;
  }
}

// Critical resource preloader for immediate needs
export const criticalPreloader = new ResourcePreloader();

// Progressive loading strategy
export class ProgressiveLoader {
  constructor() {
    this.loadingStages = new Map();
    this.currentStage = 0;
    this.observers = [];
  }

  // Define loading stages
  defineStages(stages) {
    stages.forEach((stage, index) => {
      this.loadingStages.set(index, {
        ...stage,
        loaded: false,
        progress: 0
      });
    });
  }

  // Load stage
  async loadStage(stageIndex) {
    const stage = this.loadingStages.get(stageIndex);
    if (!stage || stage.loaded) return;

    try {
      // Load stage resources
      if (stage.resources) {
        const results = await criticalPreloader.preloadImages(stage.resources);
        const successCount = results.filter(r => r.status === 'fulfilled').length;
        stage.progress = successCount / stage.resources.length;
      }

      // Execute stage callback
      if (stage.onLoad) {
        await stage.onLoad();
      }

      stage.loaded = true;
      this.currentStage = Math.max(this.currentStage, stageIndex + 1);
      
      // Notify observers
      this.notifyObservers(stageIndex, stage);
      
    } catch (error) {
      console.warn('Failed to load stage:', stageIndex, error);
    }
  }

  // Load next stage
  async loadNext() {
    if (this.loadingStages.has(this.currentStage)) {
      await this.loadStage(this.currentStage);
    }
  }

  // Load all stages up to a point
  async loadUpTo(targetStage) {
    for (let i = 0; i <= targetStage; i++) {
      await this.loadStage(i);
    }
  }

  // Add progress observer
  onProgress(callback) {
    this.observers.push(callback);
    return () => {
      const index = this.observers.indexOf(callback);
      if (index > -1) this.observers.splice(index, 1);
    };
  }

  // Notify observers
  notifyObservers(stageIndex, stage) {
    this.observers.forEach(callback => {
      callback(stageIndex, stage, this.getOverallProgress());
    });
  }

  // Get overall progress
  getOverallProgress() {
    const stages = Array.from(this.loadingStages.values());
    const totalProgress = stages.reduce((sum, stage) => sum + stage.progress, 0);
    return totalProgress / stages.length;
  }
}

// Main progressive loader instance
export const progressiveLoader = new ProgressiveLoader();

// Viewport-based lazy loading utility
export class ViewportLoader {
  constructor(options = {}) {
    this.options = {
      rootMargin: '50px',
      threshold: 0.1,
      ...options
    };
    this.observer = null;
    this.targets = new Map();
  }

  // Initialize intersection observer
  init() {
    if (!this.observer) {
      this.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        this.options
      );
    }
  }

  // Handle intersection
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const callback = this.targets.get(entry.target);
        if (callback) {
          callback(entry);
          this.unobserve(entry.target);
        }
      }
    });
  }

  // Observe element
  observe(element, callback) {
    this.init();
    this.targets.set(element, callback);
    this.observer.observe(element);
  }

  // Unobserve element
  unobserve(element) {
    if (this.observer) {
      this.observer.unobserve(element);
      this.targets.delete(element);
    }
  }

  // Cleanup
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.targets.clear();
    }
  }
}

// Global viewport loader instance
export const viewportLoader = new ViewportLoader();

// Performance hints for modern browsers
export const performanceHints = {
  // Preload critical resources
  preloadCritical(resources) {
    resources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as || 'image';
      if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
      document.head.appendChild(link);
    });
  },

  // Prefetch non-critical resources
  prefetchResources(resources) {
    resources.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = href;
      document.head.appendChild(link);
    });
  },

  // DNS prefetch for external domains
  dnsPrefetch(domains) {
    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });
  }
};

// Loading state manager
export class LoadingStateManager {
  constructor() {
    this.state = {
      isInitialLoad: true,
      loadingStage: 'initial',
      progress: 0,
      errors: []
    };
    this.listeners = [];
  }

  // Update state
  updateState(updates) {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
  }

  // Add listener
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) this.listeners.splice(index, 1);
    };
  }

  // Notify listeners
  notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // Mark loading complete
  completeLoading() {
    this.updateState({
      isInitialLoad: false,
      loadingStage: 'complete',
      progress: 1
    });
  }

  // Add error
  addError(error) {
    this.updateState({
      errors: [...this.state.errors, error]
    });
  }
}

export const loadingStateManager = new LoadingStateManager();
