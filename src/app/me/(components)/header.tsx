'use client'
import { useRef, useEffect } from "react"

import gsap from "gsap"
import SplitText from "gsap/src/SplitText"
import Avatar from "./avatar"
gsap.registerPlugin(SplitText)




const Header = () => {
  const wrapperRef = useRef<HTMLSpanElement | null>(null)
  const reverseRef = useRef<HTMLSpanElement | null>(null)
  const normalRef = useRef<HTMLSpanElement | null>(null)

  const tlRef = useRef<ReturnType<typeof gsap.timeline> | null>(null)



  useEffect(() => {
    if (!reverseRef.current || !normalRef.current) return

    const reverseSplit = new SplitText(reverseRef.current, { type: "chars" })
    const normalSplit = new SplitText(normalRef.current, { type: "chars" })

    gsap.set(normalSplit.chars, { y: 10, opacity: 0 })

    const handleEnter = () => {
      if (tlRef.current) tlRef.current.kill()

      const tl = gsap.timeline()
      tl.to(reverseSplit.chars, {
        y: -8,
        x: -6,
        opacity: 0,
        rotation: -8,
        duration: 0.36,
        ease: "power2.out",
        stagger: { each: 0.05, from: "end" },
      }, 0)

      tl.to(normalSplit.chars, {
        y: 0,
        x: 0,
        opacity: 1,
        rotation: 0,
        duration: 0.48,
        ease: "power3.out",
        stagger: { each: 0.05, from: "start" },
      }, 0.08)

      tlRef.current = tl
    }

    const handleLeave = () => {
      if (tlRef.current) tlRef.current.kill()

      const tl = gsap.timeline()
      tl.to(normalSplit.chars, {
        y: 8,
        x: 6,
        opacity: 0,
        rotation: 8,
        duration: 0.36,
        ease: "power2.in",
        stagger: { each: 0.04, from: "start" },
      }, 0)

      tl.to(reverseSplit.chars, {
        y: 0,
        x: 0,
        opacity: 1,
        rotation: 0,
        duration: 0.48,
        ease: "power3.out",
        stagger: { each: 0.05, from: "end" },
      }, 0.08)

      tlRef.current = tl
    }

    const node = wrapperRef.current
    node!.addEventListener("mouseenter", handleEnter)
    node!.addEventListener("mouseleave", handleLeave)

    return () => {
      node!.removeEventListener("mouseenter", handleEnter)
      node!.removeEventListener("mouseleave", handleLeave)
      if (tlRef.current) tlRef.current.kill()
      reverseSplit.revert()
      normalSplit.revert()
    }
  }, [])

  return (
    <div className="max-w-3xl leading-relaxed select-none">
      <Avatar />
      <p className="leading-5">
        Since you have made it this far, I will keep it short, simple, and engaging.
        Hi there! I am <span className="text-orange">Aryan</span>, born in India
        <span className="text-red-300">( fun fact: there is a 17.53% chance of being born here! ) </span>
        in the state of Uttar Pradesh. However, I have spent about 70% of my life in Punjab.
        People often label me as
        <span
          ref={wrapperRef}
          className="relative inline-block align-baseline ml-1"
          aria-hidden={false}
          style={{ lineHeight: 1 }}
        >
          <span
            ref={reverseRef}
            id="reverse"
            className="text-orange inline-block whitespace-nowrap hover:cursor-pointer"
            aria-hidden="false"
          >
            gnirob
          </span>
          <span
            ref={normalRef}
            className="text-orange inline-block absolute left-0 top-0 whitespace-nowrap pointer-events-none"
            aria-hidden="true"
            style={{ transform: "translateY(0)" }}
          >
            boring
          </span>
        </span>
        {" "}— but I call that a case of poor judgment!
        <br /><br />
        I am a curious soul, eager to explore every piece of software or programming language I come across and create something useful or fun with it. My journey began with app development, starting with Swift (a bold but questionable choice), followed by a detour into game development—another adventurous misstep. In hindsight, I could have saved 2.5 years of college by sticking to the basics.
        <br /><br />
        In my free time, I enjoy gaming and binge-watching movies or series (lately, a lot of them!). My current favorite game is <span className="text-orange">Elden Ring</span>.
        <br /><br />
        What else ..... Life is decent. I have a handful of amazing friends, love traveling, and enjoy reading—currently immersed in <span className="text-orange">Norwegian Wood</span>. Oh, and I love staying alone
      </p>
    </div>
  );

}


export default Header


