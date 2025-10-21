'use client';

import React, { useEffect, useRef } from 'react';

const IMAGE_URL = '/sprite.png';

const CANVAS_WIDTH = 180;
const CANVAS_HEIGHT = 270;
const SPRITE_WIDTH = 160;
const SPRITE_HEIGHT = 270;
const FPS = 7; // frames per second of the sprite animation

const Loader: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // scale for devicePixelRatio so it stays crisp
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = CANVAS_WIDTH * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    canvas.style.width = `${CANVAS_WIDTH}px`;
    canvas.style.height = `${CANVAS_HEIGHT}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // scale drawing operations

    const image = new Image();
    image.src = IMAGE_URL;
    image.onload = () => {
      const totalFrames = Math.max(1, Math.floor(image.width / SPRITE_WIDTH));
      let currentFrame = 0;
      let lastTime = performance.now();
      const frameDuration = 1000 / FPS;

      function loop(now: number) {
        const elapsed = now - lastTime;
        if (elapsed >= frameDuration) {
          // advance frames (supports skipping if frames are slow)
          const steps = Math.floor(elapsed / frameDuration);
          currentFrame = (currentFrame + steps) % totalFrames;
          lastTime = now - (elapsed % frameDuration);
        }

        // clear and draw current frame
        ctx!.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        const sx = currentFrame * SPRITE_WIDTH;
        const sy = 0;
        // drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
        ctx!.drawImage(
          image,
          sx,
          sy,
          SPRITE_WIDTH,
          SPRITE_HEIGHT,
          // center the sprite inside the canvas (with small padding if sizes differ)
          (CANVAS_WIDTH - SPRITE_WIDTH) / 2,
          (CANVAS_HEIGHT - SPRITE_HEIGHT) / 2,
          SPRITE_WIDTH,
          SPRITE_HEIGHT
        );

        rafRef.current = requestAnimationFrame(loop);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    // cleanup
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
      aria-hidden
    >
      <canvas
        id="loader-canvas"
        ref={canvasRef}
        style={{ pointerEvents: 'auto', display: 'block' }}
      />
    </div>
  );
};

export default Loader;
