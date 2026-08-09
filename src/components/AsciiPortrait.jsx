import React, { useRef, useEffect, useState } from "react";
import { pixelData, colorForAlpha, BACKGROUND } from "../assets/asciiData.js";

// Calculate bounds from pixelData
const xs = pixelData.map((p) => p.x);
const ys = pixelData.map((p) => p.y);
const minX = Math.min(...xs);
const maxX = Math.max(...xs);
const minY = Math.min(...ys);
const maxY = Math.max(...ys);

const xsSorted = [...new Set(xs)].sort((a, b) => a - b);
const spacing = xsSorted.length > 1 ? xsSorted[1] - xsSorted[0] : 4.9;
const baseCell = Math.max(2, spacing * 0.82);

const contentWidth = maxX - minX + spacing;
const contentHeight = maxY - minY + spacing;

const calculateSize = (width) => {
  let size = 200;
  if (width <= 480) size = Math.min(280, width - 32);
  else if (width <= 768) size = Math.min(340, width - 48);
  return Math.max(200, size);
};

// Build particles from pixelData
const buildParticlesFromPixelData = (size) => {
  const scale = size / Math.max(contentWidth, contentHeight);
  const padding = 16;
  const cellSize = Math.max(2, baseCell * scale);
  
  return pixelData.map(p => {
    const x = (p.x - minX) * scale + padding;
    const y = (p.y - minY) * scale + padding;
    return {
      x: Number(x.toFixed(1)),
      y: Number(y.toFixed(1)),
      targetX: x,
      targetY: y,
      alpha: p.alpha,
      baseAlpha: p.alpha,
      vx: 0,
      vy: 0,
      delay: Math.random() * 2,
      shimmer: Math.random() * Math.PI * 2,
      currentAlpha: 0,
      cellSize: cellSize
    };
  });
};

const AsciiPortrait = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const mouseTargetRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef([]);
  const startTimeRef = useRef(null);
  const [size, setSize] = useState(() => calculateSize(window.innerWidth));
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      setSize(calculateSize(window.innerWidth));
    };

    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    // Build particles from pixelData
    particlesRef.current = buildParticlesFromPixelData(size);
    setDataReady(true);
    startTimeRef.current = performance.now();
  }, [size]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    let animationId;

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      
      // Fill background
      ctx.fillStyle = BACKGROUND;
      ctx.fillRect(0, 0, size, size);

      if (!dataReady || !particlesRef.current.length) return;

      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const mouseTarget = mouseTargetRef.current;
      const elapsed = (performance.now() - startTimeRef.current) / 1000;

      mouse.x += (mouseTarget.x - mouse.x) * 0.15;
      mouse.y += (mouseTarget.y - mouse.y) * 0.15;

      particles.forEach((p) => {
        const particleTime = elapsed - p.delay;
        if (particleTime < 0) return;

        const fadeProgress = Math.min(particleTime / 1.5, 1);
        const easedFade = 1 - Math.pow(1 - fadeProgress, 2);
        const isActive = mouse.active || particleTime < 3.0;
        const shimmerVal = isActive ? Math.sin(elapsed * 2 + p.shimmer) * 0.1 : 0;
        p.currentAlpha = Math.max(0, Math.min(1, p.baseAlpha * easedFade + shimmerVal));

        const moveProgress = Math.min(particleTime / 2.5, 1);
        const easedMove = 1 - Math.pow(1 - moveProgress, 3);

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = size * 0.2;

          if (dist < maxDist && dist > 0) {
            const force = (1 - dist / maxDist) * 4;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        const pullStrength = 0.01 + easedMove * 0.08;
        p.vx += dx * pullStrength;
        p.vy += dy * pullStrength;

        if (isActive) {
          const breathX = Math.sin(elapsed * 0.5 + p.targetY * 0.1) * 0.15;
          const breathY = Math.cos(elapsed * 0.5 + p.targetX * 0.1) * 0.15;
          p.vx += breathX;
          p.vy += breathY;
          p.vx *= 0.92;
          p.vy *= 0.92;
        } else {
          p.vx *= 0.85;
          p.vy *= 0.85;

          if (particleTime > 4.0 && Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) {
            p.x = p.targetX;
            p.y = p.targetY;
            p.vx = 0;
            p.vy = 0;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        // Draw colored pixel instead of character
        const alpha = Math.min(1, p.currentAlpha + 0.15);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = colorForAlpha(p.alpha);
        
        // Draw pixel square
        const cell = Math.max(1.5, p.cellSize || 3);
        ctx.fillRect(p.x - cell/2, p.y - cell/2, cell, cell);
      });
      
      ctx.globalAlpha = 1;
    };

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const scaleX = size / rect.width;
      const scaleY = size / rect.height;
      mouseTargetRef.current.x = (event.clientX - rect.left) * scaleX;
      mouseTargetRef.current.y = (event.clientY - rect.top) * scaleY;
      mouseRef.current.active = true;
    };

    const handleTouchMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const touch = event.touches[0];
      const scaleX = size / rect.width;
      const scaleY = size / rect.height;
      mouseTargetRef.current.x = (touch.clientX - rect.left) * scaleX;
      mouseTargetRef.current.y = (touch.clientY - rect.top) * scaleY;
      mouseRef.current.active = true;
      if (event.cancelable) event.preventDefault();
    };

    const handleLeave = () => {
      mouseRef.current.active = false;
      mouseTargetRef.current.x = -1000;
      mouseTargetRef.current.y = -1000;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleLeave);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleLeave);

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleLeave);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleLeave);
    };
  }, [size, dataReady]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        cursor: "crosshair",
        touchAction: "none",
        // display: "block",
        // borderRadius: "12px",
        // boxShadow: "0 0 30px rgba(100, 255, 218, 0.1)",
      }}
    />
  );
};

export default AsciiPortrait;