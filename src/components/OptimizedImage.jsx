import React, { memo, useState, useCallback } from 'react';

// Optimized image component with lazy loading and error handling
const OptimizedImage = memo(({ 
  src, 
  alt, 
  className, 
  loading = "lazy", 
  priority = false,
  onLoad,
  onError,
  ...props 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLoad = useCallback((e) => {
    setImageLoaded(true);
    onLoad?.(e);
  }, [onLoad]);

  const handleError = useCallback((e) => {
    setImageError(true);
    onError?.(e);
  }, [onError]);

  if (imageError) {
    return (
      <div className={`bg-gray-800 flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-sm">Image failed to load</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-600 border-t-white rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : loading}
        onLoad={handleLoad}
        onError={handleError}
        className={`${className} ${!imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        {...props}
        style={{
          ...props.style,
          willChange: 'transform',
        }}
      />
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
