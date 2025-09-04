import React, { useState, useEffect, useRef } from 'react';
import { useSpring, motion } from 'framer-motion';

// Try to import Three.js dependencies
let Canvas, useThree, useFrame, Stars, useTexture, Bloom, EffectComposer, THREE;
let threeJsLoaded = false;

try {
  // Dynamic imports for Three.js
  const fiberModule = require('@react-three/fiber');
  Canvas = fiberModule.Canvas;
  useThree = fiberModule.useThree;
  useFrame = fiberModule.useFrame;
  
  const dreiModule = require('@react-three/drei');
  Stars = dreiModule.Stars;
  useTexture = dreiModule.useTexture;
  
  const postModule = require('@react-three/postprocessing');
  Bloom = postModule.Bloom;
  EffectComposer = postModule.EffectComposer;
  
  const threeModule = require('three');
  THREE = threeModule;
  
  threeJsLoaded = true;
} catch {
  console.warn('Three.js dependencies not available, using fallback');
  threeJsLoaded = false;
}

import ue from '../assets/ueue.png';

const Star = () => {
    const [opa, setOpa] = useState(0);
    const [contextLost, setContextLost] = useState(false);
    const [showText, setShowText] = useState(false);
    const [threeJsAvailable, setThreeJsAvailable] = useState(false);

    // Check if Three.js is available
    useEffect(() => {
        setThreeJsAvailable(!!(Canvas && useThree && useFrame && Stars));
    }, []);

    // Opacity animation for canvas with requestAnimationFrame
    useEffect(() => {
        let i = 0;
        let rafId;
        const animateOpacity = () => {
            if (i <= 100) {
                setOpa(i);
                i++;
                rafId = requestAnimationFrame(animateOpacity);
            }
        };
        rafId = requestAnimationFrame(animateOpacity);
        return () => cancelAnimationFrame(rafId);
    }, []);

    // Spring for smooth zoom and text animation
    const springConfig = { damping: 30, stiffness: 100 };
    const zSpring = useSpring(1000, springConfig); // Initial Z for zoom
    const textSpring = useSpring(-10, springConfig); // Initial Y at top

    // Scroll handler for zoom and text
    useEffect(() => {
        const handleScroll = () => {
            const section = document.querySelector('.star-section');
            if (section) {
                const rect = section.getBoundingClientRect();
                const animationHeight = rect.height - window.innerHeight;
                const progress = Math.max(0, Math.min(-rect.top / animationHeight, 1));
                const newZ = 1000 - progress * 950; // From 1000 (zoomed out) to 50 (zoomed in)
                const newTextY = 0 + progress * 50; // From 0 (top) to 50 (slightly below top)
                zSpring.set(newZ);
                textSpring.set(newTextY);

                if (newZ < 200) { // tweak this number as needed
                    setShowText(true);
                } else {
                    setShowText(false);
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial call
        return () => window.removeEventListener('scroll', handleScroll);
    }, [zSpring, textSpring]);

    // Fallback UI for context loss
    if (contextLost) {
        return (
            <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h1>WebGL rendering failed. Please refresh the page.</h1>
            </div>
        );
    }

    // If Three.js is not available, show a simple fallback
    if (!threeJsAvailable) {
        return (
            <div 
                className='bg-black' 
                style={{ width: '100vw', height: '100vh', opacity: opa / 100, position: 'relative' }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-black">
                    <div className="absolute inset-0 overflow-hidden">
                        {/* Simple CSS star animation */}
                        {Array.from({ length: 100 }).map((_, i) => (
                            <div
                                key={i}
                                className="absolute animate-pulse"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    width: `${Math.random() * 3 + 1}px`,
                                    height: `${Math.random() * 3 + 1}px`,
                                    backgroundColor: 'white',
                                    borderRadius: '50%',
                                    animationDelay: `${Math.random() * 3}s`,
                                    animationDuration: `${Math.random() * 2 + 1}s`
                                }}
                            />
                        ))}
                    </div>
                </div>

                <motion.div
                    className="absolute top-1 flex justify-center font-loadfont w-full text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-loadFont whitespace-nowrap"
                    style={{ y: textSpring }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showText ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                >
                    THEMES
                </motion.div>

                <motion.div
                    className="absolute md:top-[-40px] top-[-65px] left-1/2 -translate-x-1/2 h-[110vh] w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showText ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-64 h-64 rounded-full border-4 border-purple-500/30 animate-spin" 
                             style={{ 
                                 background: `url(${ue}) center/cover`,
                                 animationDuration: '10s'
                             }}
                        />
                    </div>
                </motion.div>
            </div>
        );
    }

    // Original Three.js implementation
    return (
        <div 
            className='bg-black' 
            style={{ width: '100vw', height: '100vh', opacity: opa / 100, position: 'relative' }}
        >
            <Canvas
                camera={{ position: [0, 0, 1000] }} // Initial Z matches zSpring
                gl={{
                    antialias: true,
                    preserveDrawingBuffer: false,
                    powerPreference: 'default',
                    alpha: true,
                }}
            >
                <ContextLossHandler setContextLost={setContextLost} />
                <CameraUpdater zSpring={zSpring} />

                {window.innerWidth >= 640 ? 
                    <Stars count={30000} speed={1} saturation={10} /> :
                    <Stars count={10000} speed={1} saturation={10} />
                }
            </Canvas>

            <motion.div
                className="absolute top-1 flex justify-center font-loadfont w-full text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-loadFont whitespace-nowrap"
                style={{ y: textSpring }}
                initial={{ opacity: 0 }}
                animate={{ opacity: showText ? 1 : 0 }}
                transition={{ duration: 0.5 }}
            >
                THEMES
            </motion.div>

            <motion.div
                className="absolute md:top-[-40px] top-[-65px] left-1/2 -translate-x-1/2 h-[110vh] w-full bg-rd-200/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: showText ? 1 : 0 }}
                transition={{ duration: 0.5 }}
            >
                <Canvas>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    <TexturedCylinder />
                    {EffectComposer && Bloom && (
                        <EffectComposer>
                            <Bloom
                                intensity={5.0}
                                mipmapBlur
                                luminanceThreshold={0}
                                luminanceSmoothing={0}
                            />
                        </EffectComposer>
                    )}
                </Canvas>
            </motion.div>
        </div>
    );
};

function TexturedCylinder() {
    if (!useTexture || !useFrame || !THREE) return null;
    
    const tex = useTexture(ue);
    const meshRef = useRef();
    const [scale, setScale] = useState([1, 1, 1]);

    useEffect(() => {
        const updateScale = () => {
            if (window.innerWidth < 640) { // sm
                setScale([0.7, 0.7, 0.7]);
            } else if (window.innerWidth < 1024) { // md
                setScale([0.85, 0.85, 0.85]);
            } else {
                setScale([1, 1, 1]); // default (laptop/desktop)
            }
        };

        updateScale();
        window.addEventListener("resize", updateScale);
        return () => window.removeEventListener("resize", updateScale);
    }, []);

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.003; // rotate smoothly
        }
    });

    return (
        <mesh ref={meshRef} rotation={[-6.15, 2, -0.04]} position={[0, 0, 0]} scale={scale}>
            <cylinderGeometry args={[3.5, 3.5, 1, 40, 40, true]} />
            <meshStandardMaterial map={tex} transparent side={THREE.DoubleSide} />
        </mesh>
    );
}

// Camera updater using useFrame for smooth updates
function CameraUpdater({ zSpring }) {
    if (!useThree || !useFrame) return null;
    
    const { camera } = useThree();

    useFrame(() => {
        camera.position.z = zSpring.get();
    });

    return null;
}

// Handle WebGL context loss
function ContextLossHandler({ setContextLost }) {
    if (!useThree) return null;
    
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
}

export default Star;
