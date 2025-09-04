/**
 * Hero Section Asset Preloader
 * Ensures critical hero assets load immediately without blocking
 */

class HeroPreloader {
  constructor() {
    this.loadedAssets = new Set();
    this.loadingPromises = new Map();
  }

  /**
   * Preload critical hero assets with high priority
   */
  async preloadHeroAssets() {
    const criticalAssets = [
      '/src/assets/image.png',
      '/src/assets/image2.png', 
      '/src/assets/image3.png',
      '/src/assets/image5.png',
      '/src/assets/logo.png'
    ];

    const loadPromises = criticalAssets.map(src => this.preloadImage(src));
    
    try {
      await Promise.allSettled(loadPromises);
      console.log('Hero assets preloaded successfully');
    } catch (error) {
      console.warn('Some hero assets failed to preload:', error);
    }
  }

  /**
   * Preload a single image with caching
   */
  preloadImage(src) {
    // Return cached promise if already loading
    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src);
    }

    // Return resolved promise if already loaded
    if (this.loadedAssets.has(src)) {
      return Promise.resolve();
    }

    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.loadedAssets.add(src);
        this.loadingPromises.delete(src);
        resolve();
      };
      
      img.onerror = () => {
        this.loadingPromises.delete(src);
        reject(new Error(`Failed to load: ${src}`));
      };
      
      // Set high priority and start loading
      img.loading = 'eager';
      img.src = src;
    });

    this.loadingPromises.set(src, promise);
    return promise;
  }

  /**
   * Preload fonts critical for hero section
   */
  preloadFonts() {
    const fontPromises = [
      // Add any custom fonts used in hero section
      this.preloadFont('loadfont', '/src/assets/fonts/fonts.css')
    ];

    return Promise.allSettled(fontPromises);
  }

  /**
   * Preload a font
   */
  preloadFont(fontFamily, fontUrl) {
    return new Promise((resolve) => {
      if (document.fonts.check(`16px ${fontFamily}`)) {
        resolve();
        return;
      }

      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = fontUrl;
      link.onload = resolve;
      link.onerror = resolve; // Don't fail if font doesn't load
      
      document.head.appendChild(link);
    });
  }

  /**
   * Initialize hero preloading
   */
  async initialize() {
    try {
      // Start both in parallel
      await Promise.all([
        this.preloadHeroAssets(),
        this.preloadFonts()
      ]);
    } catch (error) {
      console.warn('Hero preloader initialization failed:', error);
    }
  }
}

// Export singleton instance
export const heroPreloader = new HeroPreloader();

// Auto-initialize when module loads
heroPreloader.initialize();

export default HeroPreloader;
