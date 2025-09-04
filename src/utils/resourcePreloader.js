/**
 * Enhanced Resource Preloader for Codefiesta 4.0
 * Preloads critical resources to improve initial page load performance
 */

// Critical resources that should be loaded immediately
const CRITICAL_RESOURCES = {
  fonts: [
    '/fonts/fonnts.com-Rigid_Square_Bold.otf',
    '/fonts/fonnts.com-Rigid_Square_Bold_Italic.otf',
    '/src/assets/fonts/fonts.css'
  ],
  images: [
    '/src/assets/final logo.png',
    '/src/assets/backgroundO.png',
    '/src/assets/logo1.gif',
    '/src/assets/teams/teamimages.jpg'
  ]
};

// Secondary resources that can be loaded after critical resources
const SECONDARY_RESOURCES = {
  images: [
    '/src/assets/2-1.png',
    '/src/assets/image.png',
    '/src/assets/image2.png',
    '/src/assets/image3.png',
    '/src/assets/image4.png',
    '/src/assets/image5.png',
    '/src/assets/okok.png',
    '/src/assets/ueue.png',
    '/src/assets/vrmanO.png',
    '/src/assets/wdwd.png'
  ]
};

/**
 * Preload a single resource with error handling
 */
const preloadResource = (href, as, type = null, crossorigin = false) => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    
    if (type) link.type = type;
    if (crossorigin) link.crossOrigin = 'anonymous';
    
    link.onload = () => resolve(href);
    link.onerror = () => reject(new Error(`Failed to preload ${href}`));
    
    document.head.appendChild(link);
    
    // Fallback timeout
    setTimeout(() => reject(new Error(`Timeout preloading ${href}`)), 8000);
  });
};

/**
 * Enhanced critical resource preloader
 */
export const preloadCriticalResources = async () => {
  console.log('🚀 Preloading critical resources...');
  const promises = [];
  
  // Preload fonts with proper attributes
  CRITICAL_RESOURCES.fonts.forEach(font => {
    if (font.endsWith('.otf')) {
      promises.push(preloadResource(font, 'font', 'font/otf', true));
    } else {
      promises.push(preloadResource(font, 'style'));
    }
  });
  
  // Preload critical images
  CRITICAL_RESOURCES.images.forEach(image => {
    promises.push(preloadResource(image, 'image'));
  });
  
  try {
    const results = await Promise.allSettled(promises);
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    console.log(`✅ Critical resources: ${successful} loaded, ${failed} failed`);
    return true;
  } catch (error) {
    console.warn('⚠️ Critical resource preloading failed:', error);
    return false;
  }
};

/**
 * Preload secondary resources after critical ones
 */
const preloadSecondaryResources = async () => {
  // Wait before loading secondary resources
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  console.log('🔄 Preloading secondary resources...');
  
  const promises = SECONDARY_RESOURCES.images.map(image => 
    preloadResource(image, 'image').catch(error => {
      console.warn(`Secondary resource failed: ${image}`, error);
      return null;
    })
  );
  
  try {
    const results = await Promise.allSettled(promises);
    const successful = results.filter(r => r.status === 'fulfilled' && r.value).length;
    console.log(`✅ Secondary resources: ${successful} loaded`);
  } catch (error) {
    console.warn('⚠️ Secondary resource preloading failed:', error);
  }
};

/**
 * Set up resource hints for better loading
 */
const setupResourceHints = () => {
  // DNS prefetch for external resources
  const dnsPrefetch = [
    '//fonts.googleapis.com',
    '//fonts.gstatic.com'
  ];
  
  dnsPrefetch.forEach(domain => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);
  });
  
  // Preconnect to critical origins
  const preconnect = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com'
  ];
  
  preconnect.forEach(origin => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
};

/**
 * Optimize font loading performance
 */
const optimizeFontLoading = () => {
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'loadFont';
      font-display: swap;
    }
    * {
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
};

/**
 * Initialize all resource optimizations
 */
const initializeResourceOptimizations = async () => {
  if (typeof window === 'undefined') return;
  
  console.log('🚀 Initializing enhanced resource optimizations...');
  
  // Set up resource hints immediately
  setupResourceHints();
  
  // Optimize font loading
  optimizeFontLoading();
  
  // Start preloading critical resources
  const criticalSuccess = await preloadCriticalResources();
  
  // Start preloading secondary resources (non-blocking)
  if (criticalSuccess) {
    preloadSecondaryResources();
  }
  
  console.log('✅ Resource optimizations initialized');
  return criticalSuccess;
};

// Auto-initialize when script loads
if (typeof window !== 'undefined') {
  // Use requestIdleCallback if available for better performance
  if (window.requestIdleCallback) {
    window.requestIdleCallback(() => {
      initializeResourceOptimizations();
    }, { timeout: 2000 });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(initializeResourceOptimizations, 100);
  }
}

export {
  preloadSecondaryResources,
  initializeResourceOptimizations,
  preloadResource,
  setupResourceHints,
  optimizeFontLoading
};

export default initializeResourceOptimizations;
