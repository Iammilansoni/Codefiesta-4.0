import React, { useState, useEffect, useRef } from 'react';
import { useSpring, motion } from 'framer-motion';
import ueTexture from '../assets/ueue.png';

const OptimizedStar = () => {
    const [opa, setOpa] = useState(0);
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

    // Opacity animation
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

    // Initialize stars
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const starCount = window.innerWidth >= 640 ? 30000 : 10000;
        const stars = [];

        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: (Math.random() - 0.5) * 4000,
                y: (Math.random() - 0.5) * 4000,
                z: Math.random() * 2000,
                originalZ: Math.random() * 2000,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.8 + 0.2,
                speed: Math.random() * 0.02 + 0.01
            });
        }
        starsRef.current = stars;
    }, []);

    // Stars animation loop
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
                // Update star z position for movement
                star.z -= star.speed * 2;
                if (star.z <= 0) {
                    star.z = 2000;
                    star.x = (Math.random() - 0.5) * 4000;
                    star.y = (Math.random() - 0.5) * 4000;
                }

                // Project 3D to 2D with camera Z position
                const distance = star.z - cameraZ;
                if (distance <= 0) return;

                const fov = 1000;
                const scale = fov / distance;
                const x2d = centerX + (star.x * scale);
                const y2d = centerY + (star.y * scale);

                // Skip if outside canvas
                if (x2d < 0 || x2d > canvas.width || y2d < 0 || y2d > canvas.height) return;

                // Calculate size and opacity based on distance
                const size = Math.max(0.5, star.size * scale * 0.01);
                const opacity = Math.min(1, star.opacity * (2000 - distance) / 2000);

                // Draw star
                ctx.beginPath();
                ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
                ctx.fill();

                // Add saturation (colored glow) like the original
                if (size > 1) {
                    ctx.beginPath();
                    ctx.arc(x2d, y2d, size * 2, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(150, 100, 255, ${opacity * 0.3})`;
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

    // Rotating cylinder animation
    useEffect(() => {
        const canvas = cylinderCanvasRef.current;
        if (!canvas || !showText) return;

        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = ueTexture;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const animateCylinder = () => {
            if (!showText) return;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            cylinderRotationRef.current += 0.003; // Rotation speed

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            // Determine scale based on screen size
            let scale = 1;
            if (window.innerWidth < 640) scale = 0.7;
            else if (window.innerWidth < 1024) scale = 0.85;

            const radius = 200 * scale;
            const height = 100 * scale;

            // Draw cylinder by creating vertical strips
            const segments = 40;
            for (let i = 0; i < segments; i++) {
                const angle = (i / segments) * Math.PI * 2 + cylinderRotationRef.current;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY;

                ctx.save();
                ctx.translate(x, y);
                
                // Create depth effect
                const depth = Math.sin(angle) * 0.3 + 0.7;
                ctx.globalAlpha = depth;

                // Draw vertical strip of the texture
                if (img.complete) {
                    const stripWidth = (radius * Math.PI * 2) / segments;
                    const textureX = (i / segments) * img.width;
                    
                    ctx.drawImage(
                        img,
                        textureX, 0, img.width / segments, img.height,
                        -stripWidth / 2, -height / 2, stripWidth, height
                    );
                }

                ctx.restore();
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

    // Scroll handler for zoom and text
    useEffect(() => {
        const handleScroll = () => {
            const section = document.querySelector('.star-section');
            if (section) {
                const rect = section.getBoundingClientRect();
                const animationHeight = rect.height - window.innerHeight;
                const progress = Math.max(0, Math.min(-rect.top / animationHeight, 1));
                const newZ = 1000 - progress * 950;
                const newTextY = 0 + progress * 50;
                zSpring.set(newZ);
                textSpring.set(newTextY);

                if (newZ < 200) {
                    setShowText(true);
                } else {
                    setShowText(false);
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, [zSpring, textSpring]);

    return (
        <div 
            className='bg-black' 
            style={{ 
                width: '100vw', 
                height: '100vh', 
                opacity: opa / 100, 
                position: 'relative' 
            }}
        >
            {/* Stars Canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ background: 'black' }}
            />

            {/* THEMES Text */}
            <motion.div
                className="absolute top-1 flex justify-center font-loadfont w-full text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-loadFont whitespace-nowrap"
                style={{ y: textSpring }}
                initial={{ opacity: 0 }}
                animate={{ opacity: showText ? 1 : 0 }}
                transition={{ duration: 0.5 }}
            >
                THEMES
            </motion.div>

            {/* Rotating Cylinder Canvas */}
            <motion.div
                className="absolute md:top-[-40px] top-[-65px] left-1/2 -translate-x-1/2 h-[110vh] w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: showText ? 1 : 0 }}
                transition={{ duration: 0.5 }}
            >
                <canvas
                    ref={cylinderCanvasRef}
                    className="absolute inset-0 w-full h-full"
                    style={{ background: 'transparent' }}
                />
            </motion.div>
        </div>
    );
};

export default OptimizedStar;
