'use client';

import { useEffect, useRef, useCallback } from 'react';
import createGlobe from 'cobe';

interface GlobeProps {
  className?: string;
  size?: number;
}

export default function Globe({ className = '', size = 600 }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const phiRef = useRef(0);
  const widthRef = useRef(0);

  const onResize = useCallback(() => {
    if (canvasRef.current) {
      widthRef.current = canvasRef.current.offsetWidth;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', onResize);
    onResize();

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: size * 2,
      height: size * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 3,
      mapSamples: 16000,
      mapBrightness: 1.2,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.4, 0.45, 1],
      glowColor: [0.08, 0.08, 0.15],
      markers: [
        // Major tech hubs
        { location: [37.7749, -122.4194], size: 0.07 },  // San Francisco
        { location: [40.7128, -74.006], size: 0.07 },    // New York
        { location: [51.5074, -0.1278], size: 0.06 },    // London
        { location: [35.6762, 139.6503], size: 0.07 },   // Tokyo
        { location: [-33.8688, 151.2093], size: 0.06 },  // Sydney
        { location: [1.3521, 103.8198], size: 0.05 },    // Singapore
        { location: [19.4326, -99.1332], size: 0.05 },   // Mexico City
        { location: [48.8566, 2.3522], size: 0.05 },     // Paris
        { location: [12.9716, 77.5946], size: 0.06 },    // Bangalore
        { location: [52.52, 13.405], size: 0.05 },       // Berlin
        { location: [-23.5505, -46.6333], size: 0.05 },  // São Paulo
        { location: [55.7558, 37.6173], size: 0.04 },    // Moscow
      ],
      onRender: (state) => {
        if (!pointerInteracting.current) {
          phiRef.current += 0.003;
        }
        state.phi = phiRef.current + pointerInteractionMovement.current;
        state.width = size * 2;
        state.height = size * 2;
      },
    });

    return () => {
      globe.destroy();
      window.removeEventListener('resize', onResize);
    };
  }, [size, onResize]);

  return (
    <div className={`relative aspect-square ${className}`}>
      {/* Glow behind globe */}
      <div className="absolute inset-0 rounded-full bg-accent/5 blur-3xl scale-90" />
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
          canvasRef.current!.style.cursor = 'grabbing';
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          canvasRef.current!.style.cursor = 'grab';
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          if (canvasRef.current) canvasRef.current.style.cursor = 'grab';
        }}
        onMouseMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta / 200;
          }
        }}
        onTouchMove={(e) => {
          if (pointerInteracting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerInteracting.current;
            pointerInteractionMovement.current = delta / 200;
          }
        }}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'grab',
          contain: 'layout paint size',
          maxWidth: '100%',
        }}
      />
    </div>
  );
}
