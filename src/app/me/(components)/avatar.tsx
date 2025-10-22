'use client'
import { useRef, useEffect } from "react"
import gsap from "gsap"
import AgeTimer from "./timer"

const Avatar = () => {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const avatar = cardRef.current
    if (!avatar) return

    const handleEnter = () => {
      gsap.to(avatar, {
        duration: 0.8,
        rotateY: 180,
        ease: "power2.inOut",
      })
    }

    const handleLeave = () => {
      gsap.to(avatar, {
        duration: 0.8,
        rotateY: 0,
        ease: "power2.inOut",
      })
    }

    avatar.addEventListener("mouseenter", handleEnter)
    avatar.addEventListener("mouseleave", handleLeave)

    return () => {
      avatar.removeEventListener("mouseenter", handleEnter)
      avatar.removeEventListener("mouseleave", handleLeave)
    }
  }, [])

  return (
    <div className="max-w-3xl text-justify leading-relaxed select-none">
      <div
        ref={cardRef}
        id="card"
        className="float-right relative ml-4 mb-2 h-32 w-32 rounded-full"
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px",
        }}
      >
        <div
          className="absolute w-full h-full rounded-full overflow-hidden"
          style={{
            backfaceVisibility: "hidden",
            position: "absolute",
          }}
        >
          <img src="/dummy.gif" className="w-full h-full object-cover" />
        </div>

        {/* Back */}
        <div
          className="absolute w-full h-full border rounded-full overflow-hidden flex items-center justify-center"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <AgeTimer />
        </div>
      </div>
    </div>
  )
}

export default Avatar 
