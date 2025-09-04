import React, { useState, useEffect, useRef, useMemo, memo, Suspense } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Stars, useTexture } from '@react-three/drei';
import * as THREE from 'three';
// eslint-disable-next-line no-unused-vars
import { useSpring, motion } from 'framer-motion';
import ue from '../assets/ueue.png';

// Lazy load heavy post-processing components only when needed
const EffectComposer = React.lazy(() => 
  import('@react-three/postprocessing').then(module => ({ default: module.EffectComposer }))
);
const Bloom = React.lazy(() => 
  import('@react-three/postprocessing').then(module => ({ default: module.Bloom }))
);

// Optimized Star component with better performance
const Star = memo(() => {
    const [opa, setOpa] = useState(0);
    const [contextLost, setContextLost] = useState(false);
    const [showText, setShowText] = useState(false);
    const [deviceType, setDeviceType] = useState('desktop');
    const throttleRef = useRef(null);

    // Detect device type for performance optimization
    useEffect(() => {
        const getDeviceType = () => {
            const width = window.innerWidth;
            if (width < 640) return 'mobile';
            if (width < 1024) return 'tablet';
            return 'desktop';
        };
        
        setDeviceType(getDeviceType());
        
        const handleResize = () => {
            if (throttleRef.current) clearTimeout(throttleRef.current);
            throttleRef.current = setTimeout(() => {
                setDeviceType(getDeviceType());
            }, 150);
        };
        
        window.addEventListener('resize', handleResize, { passive: true });
        return () => {
            window.removeEventListener('resize', handleResize);
            if (throttleRef.current) clearTimeout(throttleRef.current);
        };
    }, []);

    // Smooth opacity animation for better startup experience
    useEffect(() => {
        let rafId;
        let currentOpa = 0;
        const targetOpa = 100;
        const duration = deviceType === 'mobile' ? 1500 : 2000; // Slower for smoother effect
        const startTime = performance.now();
        
        const animateOpacity = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Smooth easing function for opacity
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            currentOpa = easeOutQuart * targetOpa;
            
            setOpa(currentOpa);
            
            if (progress < 1) {
                rafId = requestAnimationFrame(animateOpacity);
            }
        };
        
        rafId = requestAnimationFrame(animateOpacity);
        return () => cancelAnimationFrame(rafId);
    }, [deviceType]);

    // Optimized springs configuration for smoother animations
    const springConfig = useMemo(() => ({ 
        damping: deviceType === 'mobile' ? 50 : 40, 
        stiffness: deviceType === 'mobile' ? 120 : 150,
        mass: 1,
        restDelta: 0.01
    }), [deviceType]);
    
    const zSpring = useSpring(1000, springConfig);
    const textSpring = useSpring(-10, springConfig);

    // Responsive font size calculation
    const fontSize = useMemo(() => {
        const baseSize = Math.min(window.innerWidth, window.innerHeight) * 0.08;
        switch (deviceType) {
            case 'mobile': return Math.max(24, Math.min(baseSize, 48));
            case 'tablet': return Math.max(36, Math.min(baseSize, 72));
            default: return Math.max(48, Math.min(baseSize, 96));
        }
    }, [deviceType]);

    // Smooth scroll handler with interpolation
    useEffect(() => {
        let ticking = false;
        let lastProgress = 0;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const section = document.querySelector('.star-section');
                    if (section) {
                        const rect = section.getBoundingClientRect();
                        const animationHeight = rect.height - window.innerHeight;
                        const rawProgress = Math.max(0, Math.min(-rect.top / animationHeight, 1));
                        
                        // Allow scrolling beyond animation completion
                        const isAnimationComplete = rawProgress >= 1;
                        
                        if (!isAnimationComplete) {
                            // Smooth interpolation for smoother animation
                            const smoothing = deviceType === 'mobile' ? 0.1 : 0.15;
                            const progress = lastProgress + (rawProgress - lastProgress) * smoothing;
                            lastProgress = progress;
                            
                            // Eased curves for smoother motion
                            const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
                            const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
                            
                            const easedProgress = easeInOutCubic(progress);
                            const newZ = 1000 - easedProgress * 950;
                            
                            // Center-focused text animation
                            const textProgress = easeOutCubic(progress);
                            const newTextY = -window.innerHeight * 0.1 + textProgress * window.innerHeight * 0.2;
                            
                            zSpring.set(newZ);
                            textSpring.set(newTextY);
                            
                            setShowText(newZ < 200);
                        } else {
                            // Animation is complete, maintain final state but allow scrolling
                            zSpring.set(50); // Final close position
                            textSpring.set(window.innerHeight * 0.1); // Final text position
                            setShowText(true);
                        }
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deviceType]); // zSpring and textSpring are stable refs, don't need to be dependencies

    // Performance-based star count
    const starCount = useMemo(() => {
        switch (deviceType) {
            case 'mobile': return 5000;
            case 'tablet': return 15000;
            default: return 25000;
        }
    }, [deviceType]);

    // Canvas GL settings based on device
    const glSettings = useMemo(() => ({
        antialias: deviceType !== 'mobile',
        preserveDrawingBuffer: false,
        powerPreference: deviceType === 'mobile' ? 'low-power' : 'high-performance',
        alpha: true,
        stencil: false,
        depth: true,
    }), [deviceType]);

    // Fallback UI for context loss
    if (contextLost) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-black text-white">
                <div className="text-center">
                    <h2 className="text-xl mb-2">WebGL rendering failed</h2>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 transition-colors"
                    >
                        Refresh Page
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div 
            className='bg-black w-full h-full relative flex items-center justify-center' 
            style={{ 
                opacity: opa / 100,
                pointerEvents: 'none' // Allow scroll events to pass through
            }}
        >
            <Canvas
                camera={{ 
                    position: [0, 0, 1000], 
                    fov: deviceType === 'mobile' ? 65 : deviceType === 'tablet' ? 55 : 50,
                    aspect: window.innerWidth / window.innerHeight
                }}
                gl={glSettings}
                dpr={deviceType === 'mobile' ? [1, 1.5] : [1, 2]}
                style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: '100%',
                    pointerEvents: 'none' // Allow scroll events to pass through
                }}
            >
                <ContextLossHandler setContextLost={setContextLost} />
                <CameraUpdater zSpring={zSpring} />
                <Stars count={starCount} speed={1} saturation={10} />
            </Canvas>

            <motion.div
                className="absolute inset-0 flex items-center justify-center font-loadfont text-white font-loadFont whitespace-nowrap z-10"
                style={{ 
                    y: textSpring,
                    fontSize: `${fontSize}px`,
                    pointerEvents: 'none' // Allow scroll events to pass through
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: showText ? 1 : 0, scale: showText ? 1 : 0.8 }}
                transition={{ 
                    duration: deviceType === 'mobile' ? 0.6 : 0.8, 
                    ease: [0.25, 0.1, 0.25, 1] // Custom bezier for smooth easing
                }}
            >
                THEMES
            </motion.div>

            {showText && (
                <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ pointerEvents: 'none' }} // Allow scroll events to pass through
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    transition={{ 
                        duration: deviceType === 'mobile' ? 0.8 : 1.0, 
                        ease: [0.25, 0.1, 0.25, 1], // Smooth cubic-bezier
                        type: "spring",
                        damping: 25,
                        stiffness: 120
                    }}
                >
                    <Canvas
                        camera={{ 
                            position: [0, 0, 10], 
                            fov: deviceType === 'mobile' ? 65 : deviceType === 'tablet' ? 55 : 50,
                            aspect: window.innerWidth / window.innerHeight
                        }}
                        gl={glSettings}
                        dpr={deviceType === 'mobile' ? [1, 1.5] : [1, 2]}
                        style={{ 
                            width: '100%', 
                            height: '100%',
                            pointerEvents: 'none' // Allow scroll events to pass through
                        }}
                    >
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} />
                        <TexturedCylinder deviceType={deviceType} />
                        {deviceType !== 'mobile' && (
                            <Suspense fallback={null}>
                                <EffectComposer>
                                    <Bloom
                                        intensity={deviceType === 'tablet' ? 3.0 : 5.0}
                                        mipmapBlur
                                        luminanceThreshold={0.1}
                                        luminanceSmoothing={0.1}
                                    />
                                </EffectComposer>
                            </Suspense>
                        )}
                    </Canvas>
                </motion.div>
            )}
        </div>
    );
});

// Optimized TexturedCylinder component
const TexturedCylinder = memo(({ deviceType }) => {
    const tex = useTexture(ue);
    const meshRef = useRef();
    const { viewport } = useThree();
    
    // Memoized scale based on device type and viewport
    const scale = useMemo(() => {
        const baseScale = Math.min(viewport.width, viewport.height) * 0.15;
        switch (deviceType) {
            case 'mobile': return [baseScale * 1.2, baseScale * 1.2, baseScale * 1.2];
            case 'tablet': return [baseScale * 1.3, baseScale * 1.3, baseScale * 1.3];
            default: return [baseScale, baseScale, baseScale];
        }
    }, [deviceType, viewport]);

    // Optimized geometry args based on device
    const geometryArgs = useMemo(() => {
        const segments = deviceType === 'mobile' ? 20 : deviceType === 'tablet' ? 30 : 40;
        return [3.5, 3.5, 1, segments, segments, true];
    }, [deviceType]);

    useFrame((state, delta) => {
        if (meshRef.current) {
            // Smooth rotation with delta time for consistent speed across different frame rates
            const rotationSpeed = deviceType === 'mobile' ? 0.6 : 0.8;
            meshRef.current.rotation.y += delta * rotationSpeed;
        }
    });

    return (
        <mesh 
            ref={meshRef} 
            rotation={[-6.15, 2, -0.04]} 
            position={[0, 0, 0]} 
            scale={scale}
        >
            <cylinderGeometry args={geometryArgs} />
            <meshStandardMaterial 
                map={tex} 
                transparent 
                side={THREE.DoubleSide}
                alphaTest={0.1}
            />
        </mesh>
    );
});

// Smooth camera updater with interpolation and viewport awareness
const CameraUpdater = memo(({ zSpring }) => {
    const { camera, viewport } = useThree();
    const targetPosition = useRef(1000);
    const currentPosition = useRef(1000);

    useFrame(() => {
        targetPosition.current = zSpring.get();
        
        // Smooth interpolation for camera movement
        const lerpFactor = 0.08; // Adjust for smoother/faster movement
        currentPosition.current = THREE.MathUtils.lerp(
            currentPosition.current, 
            targetPosition.current, 
            lerpFactor
        );
        
        camera.position.z = currentPosition.current;
        
        // Ensure camera is always centered
        camera.position.x = 0;
        camera.position.y = 0;
        camera.lookAt(0, 0, 0);
        
        // Update camera aspect ratio for proper centering
        camera.aspect = viewport.width / viewport.height;
        camera.updateProjectionMatrix();
    });

    return null;
});

// Enhanced context loss handler
const ContextLossHandler = memo(({ setContextLost }) => {
    const { gl } = useThree();

    useEffect(() => {
        const handleContextLost = (event) => {
            console.warn('WebGL context lost, attempting to restore...');
            event.preventDefault();
            setContextLost(true);
        };

        const handleContextRestored = () => {
            console.log('WebGL context restored');
            setContextLost(false);
        };

        gl.domElement.addEventListener('webglcontextlost', handleContextLost);
        gl.domElement.addEventListener('webglcontextrestored', handleContextRestored);

        return () => {
            gl.domElement.removeEventListener('webglcontextlost', handleContextLost);
            gl.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
        };
    }, [gl, setContextLost]);

    return null;
});



export default Star;