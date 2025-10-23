'use client'
import { useRef, useEffect, useState } from "react"
import gsap from "gsap"
import AgeTimer from "./timer"

const REQUEST_URL = 'https://api.giphy.com/v1/gifs/search?api_key=oSwRds94VT77KG9FB9Z6Ms6lwwHtQh9Y&q=anime&limit=25&offset=0&rating=g&lang=en&bundle=messaging_non_clips'


const Avatar = () => {
  const cardRef = useRef<HTMLDivElement>(null)

  const [gifUrl, setGifUrl] = useState<string | null | undefined>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(REQUEST_URL)
        const data = await res.json()
        const num = Math.floor(Math.random() * 25)
        console.log(data.data[num].images.original.url)
        setGifUrl(data.data[num].images.original.url)
      } catch (err) {
        console.error(err)
      }
    }

    fetchData()
  }, [])


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
        className="float-right ml-6 mb-3 h-32 w-32 rounded-full"
        style={{
          shapeOutside: "circle(50%)",
          clipPath: "circle(50%)",
        }}
      >
        <div
          ref={cardRef}
          id="card"
          className="relative w-full h-full rounded-full"
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px",
          }}
        >
          <div
            className="absolute w-full h-full rounded-full overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
            }}
          >
            <img
              src={gifUrl ? gifUrl : '/dummy.gif'}
              className="w-full h-full object-cover"
            />
          </div>

          <div
            className="absolute w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-black border border-light-foreground"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <AgeTimer />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Avatar 
