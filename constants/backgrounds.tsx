import React from 'react'

const DARK_BASIC_GRID = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full bg-black relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#000000",
          backgroundImage: `
        linear-gradient(to right, rgba(75, 85, 99, 0.4) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(75, 85, 99, 0.4) 1px, transparent 1px)
      `,
          backgroundSize: "40px 40px",
        }}
      />
      {children}
    </div>
  )
}

const DARK_DOT_MATRIX = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundColor: '#0a0a0a',
          backgroundImage: `
       radial-gradient(circle at 25% 25%, #222222 0.5px, transparent 1px),
       radial-gradient(circle at 75% 75%, #111111 0.5px, transparent 1px)
     `,
          backgroundSize: '10px 10px',
          imageRendering: 'pixelated',
        }}
      />
      {children}
    </div>
  )
}


const DARK_CIRCUIT_BOARD = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full relative bg-[#171717]">
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
        linear-gradient(90deg, #171717 1px, transparent 1px),
        linear-gradient(180deg, #171717 1px, transparent 1px),
        linear-gradient(90deg, #262626 1px, transparent 1px),
        linear-gradient(180deg, #262626 1px, transparent 1px)
      `,
          backgroundSize: "50px 50px, 50px 50px, 10px 10px, 10px 10px",
        }}
      />
      {children}
    </div>
  )
}

const MAGENTA_ORB_GRID = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full bg-[#020617] relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#020617",
          backgroundImage: `
        linear-gradient(to right, rgba(71,85,105,0.15) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(71,85,105,0.15) 1px, transparent 1px),
        radial-gradient(circle at 50% 60%, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)
      `,
          backgroundSize: "40px 40px, 40px 40px, 100% 100%",
        }}
      />
      {children}
    </div>
  )
}

const DARK_NOISE_COLORED = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full bg-black relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#000000",
          backgroundImage: `
        radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.2) 1px, transparent 0),
        radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.18) 1px, transparent 0),
        radial-gradient(circle at 1px 1px, rgba(236, 72, 153, 0.15) 1px, transparent 0)
      `,
          backgroundSize: "20px 20px, 30px 30px, 25px 25px",
          backgroundPosition: "0 0, 10px 10px, 15px 5px",
        }}
      />
      {children}
    </div>
  )
}

const DARK_WHITE_DOTTED = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full bg-black relative">
      {/* Dark White Dotted Grid Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "#000000",
          backgroundImage: `
        radial-gradient(circle, rgba(255, 255, 255, 0.2) 1.5px, transparent 1.5px)
      `,
          backgroundSize: "30px 30px",
          backgroundPosition: "0 0",
        }}
      />
      {children}
    </div>
  )
}

const DIAGONAL_FADE_BOTTOM = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full bg-black relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
        linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)
      `,
          backgroundSize: "32px 32px",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 0% 100%, #000 50%, transparent 90%)",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 0% 100%, #000 50%, transparent 90%)",
        }}
      />
      {children}
    </div>
  )
}

const DASHED_BOTTOM_GRID = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full bg-black relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
        linear-gradient(to right, rgba(255,255,255,0.12) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255,255,255,0.12) 1px, transparent 1px)
      `,
          backgroundSize: "20px 20px",
          backgroundPosition: "0 0, 0 0",
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
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      />
      {children}
    </div>
  )
}






export const BACKGROUNDS = [
  DARK_BASIC_GRID,
  DARK_DOT_MATRIX,
  DARK_CIRCUIT_BOARD,
  MAGENTA_ORB_GRID,
  DARK_NOISE_COLORED,
  DARK_WHITE_DOTTED,
  DIAGONAL_FADE_BOTTOM,
  DASHED_BOTTOM_GRID
]
