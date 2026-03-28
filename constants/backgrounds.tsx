import React from 'react'

const DARK_DOT_MATRIX = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full relative" style={{ backgroundColor: 'var(--bg)' }}>
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: 'var(--bg)',
          backgroundImage: `
            radial-gradient(circle at 25% 25%, var(--bg-dot-1) 0.5px, transparent 1px),
            radial-gradient(circle at 75% 75%, var(--bg-dot-2) 0.5px, transparent 1px)
          `,
          backgroundSize: '10px 10px',
          imageRendering: 'pixelated',
        }}
      />
      {children}
    </div>
  )
}

const DARK_NOISE_COLORED = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full relative" style={{ backgroundColor: 'var(--bg)' }}>
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'var(--bg)',
          backgroundImage: `
            radial-gradient(circle at 1px 1px, var(--bg-noise-1) 1px, transparent 0),
            radial-gradient(circle at 1px 1px, var(--bg-noise-2) 1px, transparent 0),
            radial-gradient(circle at 1px 1px, var(--bg-noise-3) 1px, transparent 0)
          `,
          backgroundSize: '20px 20px, 30px 30px, 25px 25px',
          backgroundPosition: '0 0, 10px 10px, 15px 5px',
        }}
      />
      {children}
    </div>
  )
}

const DARK_WHITE_DOTTED = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full relative" style={{ backgroundColor: 'var(--bg)' }}>
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'var(--bg)',
          backgroundImage: `
            radial-gradient(circle, var(--bg-white-dot) 1.5px, transparent 1.5px)
          `,
          backgroundSize: '30px 30px',
          backgroundPosition: '0 0',
        }}
      />
      {children}
    </div>
  )
}

const DIAGONAL_FADE_BOTTOM = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full relative" style={{ backgroundColor: 'var(--bg)' }}>
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--bg-line) 1px, transparent 1px),
            linear-gradient(to bottom, var(--bg-line) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 80% at 0% 100%, #000 50%, transparent 90%)',
          maskImage:
            'radial-gradient(ellipse 80% 80% at 0% 100%, #000 50%, transparent 90%)',
        }}
      />
      {children}
    </div>
  )
}

const DASHED_BOTTOM_GRID = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full relative" style={{ backgroundColor: 'var(--bg)' }}>
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, var(--bg-line) 1px, transparent 1px),
            linear-gradient(to bottom, var(--bg-line) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 0',
          WebkitMaskImage: `
            repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)
          `,
          maskImage: `
            repeating-linear-gradient(
              to right,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            repeating-linear-gradient(
              to bottom,
              black 0px,
              black 3px,
              transparent 3px,
              transparent 8px
            ),
            radial-gradient(ellipse 100% 80% at 50% 100%, #000 50%, transparent 90%)
          `,
          maskComposite: 'intersect',
          WebkitMaskComposite: 'source-in',
        }}
      />
      {children}
    </div>
  )
}

const MATRIX_GREEN = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full relative text-foreground" style={{ backgroundColor: 'var(--bg)' }}>
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, var(--bg-matrix-1) 0, var(--bg-matrix-1) 1px, transparent 1px, transparent 12px),
            repeating-linear-gradient(-45deg, var(--bg-matrix-1) 0, var(--bg-matrix-1) 1px, transparent 1px, transparent 12px),
            repeating-linear-gradient(90deg, var(--bg-matrix-2) 0, var(--bg-matrix-2) 1px, transparent 1px, transparent 4px)
          `,
          backgroundSize: '24px 24px, 24px 24px, 8px 8px',
        }}
      />
      {children}
    </div>
  )
}

const AURA_EDGE_GLOW = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden" style={{ backgroundColor: 'var(--bg)' }}>
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `radial-gradient(ellipse 50% 100% at 10% 0%, var(--bg-aura), transparent 65%), var(--bg)`,
        }}
      />
      {children}
    </div>
  )
}

const STRIPPED_DARK = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full relative" style={{ backgroundColor: 'var(--bg)' }}>
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            'repeating-linear-gradient(45deg, var(--bg) 0px, var(--bg-stripped-mid) 2px, var(--bg) 4px, var(--bg-stripped-hi) 6px)',
        }}
      />
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(45px) grayscale(20%)',
          WebkitBackdropFilter: 'blur(45px) grayscale(20%)',
        }}
      />
      {children}
    </div>
  )
}

export const BACKGROUNDS = [
  DARK_DOT_MATRIX,
  DASHED_BOTTOM_GRID,
  DIAGONAL_FADE_BOTTOM,
  DARK_WHITE_DOTTED,
  AURA_EDGE_GLOW,
  MATRIX_GREEN,
  DARK_NOISE_COLORED,
]
