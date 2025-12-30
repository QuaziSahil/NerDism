import { useEffect, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import './CustomCursor.css';

const CustomCursor = () => {
    // Direct value updates for 0 lag
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const moveCursor = (e) => {
            cursorX.set(e.clientX); // Removed offset for precision crosshair
            cursorY.set(e.clientY);
        };

        const handleHoverStart = (e) => {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.closest('button')) {
                setIsHovering(true);
            }
        };

        const handleHoverEnd = () => {
            setIsHovering(false);
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleHoverStart);
        window.addEventListener('mouseout', handleHoverEnd);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleHoverStart);
            window.removeEventListener('mouseout', handleHoverEnd);
        };
    }, [cursorX, cursorY]);

    return (
        <motion.div
            className={`custom-cursor ${isHovering ? 'hovering' : ''}`}
            style={{
                translateX: cursorX,
                translateY: cursorY,
            }}
        >
            <div className="cursor-dot"></div>
            <div className="cursor-crosshair"></div>
        </motion.div>
    );
};

export default CustomCursor;
