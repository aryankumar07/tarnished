'use client'
import Header from "./(components)/header"

export default function Page() {
  // overlay style mirrors the approach used previously — frosted blur + radial mask
  const overlayStyle = {
    background: 'linear-gradient(180deg, rgba(0,0,0,0.65), rgba(0,0,0,0.55))',
    WebkitBackdropFilter: 'blur(6px) saturate(120%)',
    backdropFilter: 'blur(6px) saturate(120%)',
    WebkitMaskImage: 'radial-gradient(circle at 50% 20%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0) 100%)',
    maskImage: 'radial-gradient(circle at 50% 20%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0) 100%)',
  }

  return (
    <div className="flex justify-center items-center p-8 w-full">
      <div className="relative w-full max-w-[900px] mx-auto rounded-2xl overflow-hidden">
        <div className="absolute inset-0 z-10 pointer-events-none" style={overlayStyle} aria-hidden="true" />
        <div className="relative z-20 flex flex-col justify-center items-center p-8 bg-black/60">
          <Header />
        </div>
      </div>
    </div>
  )
}
