import React, { useRef, useEffect } from "react";

type SnowOptions = {
  particleCount?: number;
  maxSize?: number;
  speed?: number;
  wind?: number;
  color?: string;
  blur?: boolean;
  cometMode?: boolean;
  cometCount?: number;
  tailLength?: number;
};

export default function SnowParticleBackground({
  particleCount = 120,
  maxSize = 4,
  speed = 0.35,
  wind = 0.25,
  color = "rgba(255,255,255,0.95)",
  blur = true,
  cometMode = false,
  cometCount = 8,
  tailLength = 14,
}: SnowOptions) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const particlesRef = useRef<any[]>([]);
  const dprRef = useRef<number>(1);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    let width = 0;
    let height = 0;

    function setSize() {
      const dpr = window.devicePixelRatio || 1;
      dprRef.current = dpr;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function random(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    function makeSnowParticle() {
      const size = Math.max(0.6, Math.random() * maxSize);
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: size,
        speed: random(0.2, 1.2) * speed,
        sway: random(0.5, 2.0),
        phase: Math.random() * Math.PI * 2,
        alpha: random(0.3, 1),
        drift: random(-0.5, 0.5) * wind,
      };
    }

    function makeCometParticle() {
      const angle = random(Math.PI * 0.15, Math.PI * 0.6); // angle down-right-ish
      const speedBase = random(120, 420) * (speed + 0.6); // px/sec base
      const vx = Math.cos(angle) * speedBase;
      const vy = Math.sin(angle) * speedBase;
      const size = Math.max(1.6, Math.random() * (maxSize * 2.0));
      const startX = random(-width * 0.2, width * 1.1);
      const startY = random(-height * 0.35, -20);

      return {
        x: startX,
        y: startY,
        vx,
        vy,
        radius: size,
        alpha: random(0.7, 1),
        hueOffset: random(-20, 20),
        history: [] as { x: number; y: number; radius: number; alpha: number }[],
      };
    }

    function initParticles() {
      particlesRef.current = [];
      if (cometMode) {
        for (let i = 0; i < cometCount; i++) {
          particlesRef.current.push(makeCometParticle());
        }
      } else {
        for (let i = 0; i < particleCount; i++) {
          particlesRef.current.push(makeSnowParticle());
        }
      }
    }

    let lastTime = performance.now();

    function update(dt: number) {
      const particles = particlesRef.current;

      if (cometMode) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          p.x += p.vx * dt + (wind * 30 * dt);
          p.y += p.vy * dt;

          p.history.unshift({ x: p.x, y: p.y, radius: p.radius, alpha: p.alpha });
          if (p.history.length > tailLength) p.history.pop();

          p.vx += (Math.random() - 0.5) * 8 * dt;
          p.vy += (Math.random() - 0.5) * 8 * dt;

          p.alpha = Math.max(0, p.alpha - 0.01 * dt);

          const offLeft = p.x < -width * 0.25;
          const offRight = p.x > width * 1.25;
          const offBottom = p.y > height + 200 || p.alpha <= 0.02;
          if (offLeft || offRight || offBottom) {
            particles[i] = makeCometParticle();
          }
        }
      } else {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.y += p.speed * 60 * dt; // convert to px/sec-ish
          p.phase += 0.002 + p.sway * 0.001;
          p.x += Math.sin(p.phase) * p.sway * 0.25 + p.drift * 60 * dt;

          p.alpha += Math.sin(performance.now() * 0.0005 + i) * 0.001;
          if (p.alpha > 1) p.alpha = 1;
          if (p.alpha < 0.15) p.alpha = 0.15;

          if (p.y - p.radius > height || p.x < -50 || p.x > width + 50) {
            particles[i] = makeSnowParticle();
            particles[i].y = -10 - Math.random() * 50;
          }
        }
      }
    }

    function drawComet(p: any) {
      const hist = p.history;
      if (!hist || hist.length === 0) return;

      for (let i = hist.length - 1; i >= 0; i--) {
        const t = i / hist.length;
        const point = hist[i];
        const radius = Math.max(0.2, point.radius * (t * 0.9 + 0.1));
        const a = point.alpha * (t * 0.9 + 0.1);

        const grad = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius * 3);
        // attempt to preserve user color while using alpha
        const rgbaBase = color.match(/rgba?\(([^)]+)\)/);
        let baseColor = "255,255,255";
        if (rgbaBase) baseColor = rgbaBase[1].split(",").slice(0, 3).join(",");
        grad.addColorStop(0, `rgba(${baseColor},${a})`);
        grad.addColorStop(1, `rgba(${baseColor},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(point.x, point.y, Math.max(0.2, radius), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.beginPath();
      const headGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
      const rgbaBase = color.match(/rgba?\(([^)]+)\)/);
      let baseColor = "255,255,255";
      if (rgbaBase) baseColor = rgbaBase[1].split(",").slice(0, 3).join(",");
      headGrad.addColorStop(0, `rgba(${baseColor},${Math.min(1, p.alpha + 0.3)})`);
      headGrad.addColorStop(1, `rgba(${baseColor},0)`);
      ctx.fillStyle = headGrad;
      ctx.arc(p.x, p.y, Math.max(1.2, p.radius), 0, Math.PI * 2);
      ctx.fill();
    }

    function draw() {
      if (cometMode) {
        ctx.fillStyle = "rgba(0,0,0,0.12)";
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.clearRect(0, 0, width, height);
      }

      if (blur) ctx.save();

      const particles = particlesRef.current;

      if (cometMode) {
        for (const p of particles) {
          drawComet(p);
        }
      } else {
        for (const p of particles) {
          ctx.beginPath();
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 1.6);
          grad.addColorStop(0, color.replace(/rgba\(([^)]+)\)/, (m, g1) => `rgba(${g1.split(",")[0]},${g1.split(",")[1]},${g1.split(",")[2]},${p.alpha})`));
          grad.addColorStop(1, `rgba(255,255,255,0)`);
          ctx.fillStyle = grad;
          ctx.arc(p.x, p.y, Math.max(0.4, p.radius), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (blur) ctx.restore();
    }

    function loop(now: number) {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      update(dt);
      draw();
      rafRef.current = requestAnimationFrame(loop);
    }

    setSize();
    initParticles();
    lastTime = performance.now();
    rafRef.current = requestAnimationFrame(loop);

    let resizeTimer: number | null = null;
    function onResize() {
      if (resizeTimer != null) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        setSize();
        initParticles();
      }, 120);
    }

    window.addEventListener("resize", onResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [particleCount, maxSize, speed, wind, color, blur, cometMode, cometCount, tailLength]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
        display: "block",
        top: 0,
        left: 0,
      }}
    />
  );
}
