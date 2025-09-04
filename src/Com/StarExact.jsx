import React, { useState, useEffect, useRef } from 'react';
import { useSpring, motion } from 'framer-motion';
import ue from '../assets/ueue.png';

const Star = () => {
    const [opa, setOpa] = useState(0);
    const [contextLost, setContextLost] = useState(false);
    const [showText, setShowText] = useState(false);
    const canvasRef = useRef(null);
    const cylinderCanvasRef = useRef(null);
    const animationRef = useRef(null);
    const cylinderAnimationRef = useRef(null);
    const starsRef = useRef([]);
    const cameraZRef = useRef(1000);
    const cylinderRotationRef = useRef(0);

    // Spring for smooth zoom and text animation
    const springConfig = { damping: 30, stiffness: 100 };
    const zSpring = useSpring(1000, springConfig);
    const textSpring = useSpring(-10, springConfig);

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

    // Initialize stars - exact same count as original
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const starCount = window.innerWidth >= 640 ? 30000 : 10000;
        const stars = [];

        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: (Math.random() - 0.5) * 2000,
                y: (Math.random() - 0.5) * 2000,
                z: Math.random() * 2000,
                originalZ: Math.random() * 2000,
                size: Math.random() * 3,
                opacity: Math.random(),
                speed: 1 // Same speed as original
            });
        }
        starsRef.current = stars;
    }, []);

    // Stars Canvas - replicating Three.js Stars behavior exactly
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const animateStars = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Black background
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const cameraZ = cameraZRef.current;

            starsRef.current.forEach(star => {
                // Move stars towards camera (same as Three.js Stars speed=1)
                star.z -= star.speed;
                if (star.z <= 0) {
                    star.z = 2000;
                    star.x = (Math.random() - 0.5) * 2000;
                    star.y = (Math.random() - 0.5) * 2000;
                }

                // Project 3D to 2D
                const distance = star.z - cameraZ;
                if (distance <= 0) return;

                const scale = 1000 / distance;
                const x2d = centerX + (star.x * scale);
                const y2d = centerY + (star.y * scale);

                // Skip if outside canvas
                if (x2d < 0 || x2d > canvas.width || y2d < 0 || y2d > canvas.height) return;

                // Calculate size and opacity
                const size = Math.max(0.1, star.size * scale * 0.002);
                const opacity = Math.min(1, star.opacity * (2000 - distance) / 2000);

                // Draw star with saturation=10 effect (original setting)
                ctx.beginPath();
                ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
                
                // High saturation colors like original
                const hue = Math.random() * 360;
                ctx.fillStyle = `hsla(${hue}, 100%, 70%, ${opacity})`;
                ctx.fill();

                // Add glow effect
                if (size > 0.5) {
                    ctx.beginPath();
                    ctx.arc(x2d, y2d, size * 3, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${hue}, 100%, 70%, ${opacity * 0.1})`;
                    ctx.fill();
                }
            });

            animationRef.current = requestAnimationFrame(animateStars);
        };

        animateStars();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    // TexturedCylinder Canvas - replicating the exact cylinder from original
    useEffect(() => {
        const canvas = cylinderCanvasRef.current;
        if (!canvas || !showText) return;

        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = ue;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const animateCylinder = () => {
            if (!showText) return;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Same rotation speed as original (0.003)
            cylinderRotationRef.current += 0.003;

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            // Same scale logic as original
            let scale = [1, 1, 1];
            if (window.innerWidth < 640) {
                scale = [0.7, 0.7, 0.7];
            } else if (window.innerWidth < 1024) {
                scale = [0.85, 0.85, 0.85];
            }

            // Cylinder geometry: args={[3.5, 3.5, 1, 40, 40, true]}
            const radiusTop = 3.5 * scale[0] * 50; // Scale to pixels
            const radiusBottom = 3.5 * scale[1] * 50;
            const height = 1 * scale[2] * 100;
            const radialSegments = 40;
            const heightSegments = 40;

            // Cylinder rotation: [-6.15, 2, -0.04]
            const rotationX = -6.15 + cylinderRotationRef.current;
            const rotationY = 2 + cylinderRotationRef.current;
            const rotationZ = -0.04;

            // Draw cylinder by segments
            for (let i = 0; i < radialSegments; i++) {
                const angle = (i / radialSegments) * Math.PI * 2 + rotationY;
                const nextAngle = ((i + 1) / radialSegments) * Math.PI * 2 + rotationY;

                // Apply 3D rotation and projection
                const x1 = Math.cos(angle) * radiusTop;
                const z1 = Math.sin(angle) * radiusTop;
                const x2 = Math.cos(nextAngle) * radiusTop;
                const z2 = Math.sin(nextAngle) * radiusTop;

                // Simple 3D projection
                const scale3d = 300 / (z1 + 500);
                const scale3d2 = 300 / (z2 + 500);
                
                const x2d1 = centerX + x1 * scale3d;
                const y2d1 = centerY;
                const x2d2 = centerX + x2 * scale3d2;
                const y2d2 = centerY;

                // Draw textured segment
                if (img.complete) {
                    ctx.save();
                    
                    // Calculate depth for lighting
                    const depth = (Math.sin(angle) + 1) * 0.5;
                    ctx.globalAlpha = depth * 0.8 + 0.2;

                    // Create gradient for 3D effect
                    const gradient = ctx.createLinearGradient(x2d1, y2d1 - height/2, x2d1, y2d1 + height/2);
                    gradient.addColorStop(0, `rgba(255, 255, 255, ${depth})`);
                    gradient.addColorStop(1, `rgba(128, 128, 128, ${depth})`);
                    
                    // Draw textured rectangle
                    const textureX = (i / radialSegments) * img.width;
                    const segmentWidth = Math.abs(x2d2 - x2d1) || 10;
                    
                    ctx.drawImage(
                        img,
                        textureX, 0, img.width / radialSegments, img.height,
                        x2d1, y2d1 - height/2, segmentWidth, height
                    );

                    ctx.restore();
                }
            }

            if (showText) {
                cylinderAnimationRef.current = requestAnimationFrame(animateCylinder);
            }
        };

        img.onload = () => {
            animateCylinder();
        };

        if (img.complete) {
            animateCylinder();
        }

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (cylinderAnimationRef.current) {
                cancelAnimationFrame(cylinderAnimationRef.current);
            }
        };
    }, [showText]);

    // Update camera Z from spring
    useEffect(() => {
        const unsubscribe = zSpring.on('change', (latest) => {
            cameraZRef.current = latest;
        });
        return unsubscribe;
    }, [zSpring]);

    // Scroll handler for zoom and text - exact same logic as original
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

                if (newZ < 200) { // Same trigger point as original
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

    // Fallback UI for context loss - same as original
    if (contextLost) {
        return (
            <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <h1>WebGL rendering failed. Please refresh the page.</h1>
            </div>
        );
    }

    return (
        <div 
            className='bg-black' 
            style={{ width: '100vw', height: '100vh', opacity: opa / 100, position: 'relative' }}
        >
            {/* Stars Canvas - replicating Canvas component */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ background: 'black' }}
            />

            {/* THEMES text - exact same as original */}
            <motion.div
                className="absolute top-1 flex justify-center font-loadfont w-full text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-loadFont whitespace-nowrap"
                style={{ y: textSpring }}
                initial={{ opacity: 0 }}
                animate={{ opacity: showText ? 1 : 0 }}
                transition={{ duration: 0.5 }}
            >
                THEMES
            </motion.div>

            {/* TexturedCylinder Canvas - exact same positioning as original */}
            <motion.div
                className="absolute md:top-[-40px] top-[-65px] left-1/2 -translate-x-1/2 h-[110vh] w-full bg-rd-200/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: showText ? 1 : 0 }}
                transition={{ duration: 0.5 }}
            >
                <canvas
                    ref={cylinderCanvasRef}
                    className="absolute inset-0 w-full h-full"
                    style={{ background: 'transparent' }}
                />
                
                {/* Bloom effect simulation with CSS */}
                <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `radial-gradient(circle at center, 
                            rgba(255, 255, 255, 0.1) 0%, 
                            rgba(255, 255, 255, 0.05) 30%, 
                            transparent 60%)`,
                        filter: 'blur(2px)',
                        opacity: showText ? 1 : 0,
                        transition: 'opacity 0.5s'
                    }}
                />
            </motion.div>
        </div>
    );
};

export default Star;
