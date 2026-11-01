import React, { useState, useEffect } from 'react';
import './RetroGridBackground.css';

interface InteractiveHexagonBackgroundProps {
  className?: string;
  style?: React.CSSProperties;
}

export const InteractiveHexagonBackground: React.FC<InteractiveHexagonBackgroundProps> = ({
  className = '',
  style = {}
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePos({ x: nx, y: ny });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        const nx = (t.clientX / window.innerWidth - 0.5) * 2;
        const ny = (t.clientY / window.innerHeight - 0.5) * 2;
        setMousePos({ x: nx, y: ny });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return (
    <div className={`retro-grid-viewport ${className}`} style={style}>
      {/* 3D Dual-Plane Grid Container with subtle interactive parallax */}
      <div
        className="grid-container"
        style={{
          perspectiveOrigin: `${50 + mousePos.x * 5}% ${50 + mousePos.y * 4}%`
        }}
      >
        {/* Floor Plane (receding forward into center horizon) */}
        <div className="plane">
          <div className="grid" />
          <div className="glow" />
        </div>

        {/* Ceiling Plane (receding forward into center horizon) */}
        <div className="plane">
          <div className="grid" />
          <div className="glow" />
        </div>
      </div>
    </div>
  );
};
