import React, { useRef, useEffect } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hue: number;
  alpha: number;
};

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

export function ParticleCanvas({
  count,
  speedMultiplier,
  showLines,
  bgAlpha,
  maxLinkDistance,
}: {
  count: number;
  speedMultiplier: number;
  showLines: boolean;
  bgAlpha: number;
  maxLinkDistance: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const dpiRef = useRef<number>(window.devicePixelRatio || 1);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Resize canvas to match parent width and parent's scrollHeight
  const fitToParent = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement!;
    const rect = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    dpiRef.current = dpr;

    const width = Math.max(1, rect.width);
    const height = Math.max(1, parent.scrollHeight || rect.height);

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  };

  // (Re)initialize particles based on parent size (use parent's scrollHeight)
  const initParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement!;
    const rect = parent.getBoundingClientRect();
    const w = Math.floor(rect.width * dpiRef.current);
    const h = Math.floor((parent.scrollHeight || rect.height) * dpiRef.current);

    const arr: Particle[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: rand(0, w),
        y: rand(0, h),
        vx: rand(-0.8, 0.8),
        vy: rand(-0.8, 0.8),
        radius: rand(1, 3),
        hue: Math.floor(rand(180, 260)), // blue-cyan-purple
        alpha: rand(0.5, 1),
      });
    }
    particlesRef.current = arr;
  };

  // Setup resize handling & observers
  useEffect(() => {
    fitToParent();
    initParticles();

    const canvas = canvasRef.current!;
    const parent = canvas.parentElement!;
    // Re-fit when the parent size or content changes
    if (typeof ResizeObserver !== "undefined") {
      resizeObserverRef.current = new ResizeObserver(() => {
        fitToParent();
        // do not re-init particles on every resize (keeps animation smooth),
        // but if you want to scale particles you could re-init depending on needs
      });
      resizeObserverRef.current.observe(parent);
    }

    // Also on window resize
    window.addEventListener("resize", fitToParent);
    // On load (images, fonts etc)
    window.addEventListener("load", fitToParent);

    return () => {
      window.removeEventListener("resize", fitToParent);
      window.removeEventListener("load", fitToParent);
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
        resizeObserverRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;

      // Black background with slight alpha for trails
      ctx.fillStyle = `rgba(0, 0, 0, ${bgAlpha})`;
      ctx.fillRect(0, 0, w, h);

      const particles = particlesRef.current;

      // Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx * speedMultiplier * dpiRef.current;
        p.y += p.vy * speedMultiplier * dpiRef.current;

        // Wrap around edges
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * dpiRef.current, 0, Math.PI * 2);
        ctx.closePath();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = `hsl(${p.hue}, 80%, 70%)`; // blue-cyan-purple
        ctx.fill();
      }

      // Draw connecting lines
      if (showLines) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i];
            const b = particles[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < maxLinkDistance * dpiRef.current) {
              const alpha = 0.7 * (1 - dist / (maxLinkDistance * dpiRef.current));
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = `rgba(80, 220, 255, ${alpha})`; // bright cyan
              ctx.lineWidth = 0.8 * dpiRef.current;
              ctx.stroke();
              ctx.closePath();
            }
          }
        }
      }

      rafRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [speedMultiplier, showLines, bgAlpha, maxLinkDistance]);

  // Click to add particles
  useEffect(() => {
    const canvas = canvasRef.current!;
    const handlePointerDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * dpiRef.current;
      const y = (e.clientY - rect.top) * dpiRef.current;
      for (let i = 0; i < 12; i++) {
        particlesRef.current.push({
          x,
          y,
          vx: rand(-2, 2),
          vy: rand(-2, 2),
          radius: rand(1, 3.5),
          hue: Math.floor(rand(180, 260)), // blue-cyan-purple
          alpha: rand(0.6, 1),
        });
      }
      if (particlesRef.current.length > 800) particlesRef.current.splice(0, 200);
    };
    // pointer-events-none on canvas prevents pointer events reaching it, but let's still attach to parent
    const parent = canvas.parentElement!;
    parent.addEventListener("pointerdown", handlePointerDown);
    return () => parent.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  // Note: canvas is absolutely positioned and pointer-events-none so it doesn't block interaction.
  return (
    <canvas
      ref={canvasRef}
      className="absolute left-0 top-0 block w-full pointer-events-none z-0"
    // style ensures the canvas is visually absolute; sizing handled in JS (fitToParent)
    />
  );
}
