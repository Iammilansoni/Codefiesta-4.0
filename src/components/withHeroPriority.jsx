import React from 'react';

/**
 * Hero Priority Wrapper - Ensures hero section gets maximum loading priority
 */
const withHeroPriority = (WrappedComponent) => {
  const HeroPriorityComponent = React.memo((props) => {
    // Set maximum priority for this component
    React.useLayoutEffect(() => {
      // Boost priority for hero-related tasks
      if (typeof window !== 'undefined' && window.requestIdleCallback) {
        window.requestIdleCallback(() => {
          // Trigger browser optimization hints
          if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
              // Ensure hero assets have priority
              const heroImages = document.querySelectorAll('img[src*="image"], img[src*="logo"]');
              heroImages.forEach(img => {
                if (img.loading !== 'eager') {
                  img.loading = 'eager';
                }
                if (!img.fetchPriority) {
                  img.fetchPriority = 'high';
                }
              });
            });
          }
        });
      }
    }, []);

    return (
      <div 
        className="hero-priority-container"
        style={{
          isolation: 'isolate', // Create stacking context
          willChange: 'transform', // Optimize for animations
        }}
      >
        <WrappedComponent {...props} />
      </div>
    );
  });

  HeroPriorityComponent.displayName = `withHeroPriority(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return HeroPriorityComponent;
};

export default withHeroPriority;
