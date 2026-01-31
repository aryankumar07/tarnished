'use client'
import { BackgroundSelector } from "../../components/background_selector"
import { useState, useEffect } from "react"
import Header from "../../components/header"
import gsap from "gsap"
import { useGSAP } from "@gsap/react";
import Contacts from "../../components/contacts"
import Experiences from "../../components/experiences"
import Projects from "../../components/projects"
import Skills from "../../components/skills"
import Blogs from "../../components/blogs"
import Loader from "../../components/loader"
import toast, { Toaster } from "react-hot-toast"


gsap.registerPlugin(useGSAP);
let LoadedFirst = false;
export default function Home() {
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    setIsClient(true)
    if (!LoadedFirst) {
      LoadedFirst = true
      toast.custom((t) => (
        <div
          className={`${t.visible ? "animate-custom-enter" : "animate-custom-leave"} max-w-md w-full shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-50 border border-light-foreground/50 bg-black/90`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-6 w-6 text-orange"
                  aria-hidden
                >
                  <path d="M12 2v6" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 22v-6" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4.93 4.93l4.24 4.24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18.07 19.07l-4.24-4.24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <div className="text-sm font-medium">Watch for some easter eggs</div>
                <div className="mt-1 text-xs">Tap around — surprises are hidden in the UI.</div>
              </div>
            </div>
          </div>
          <div className="flex border-l border-light-foreground/50">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-orange hover:text-orange/50 focus:outline-none focus:ring-2 focus:ring-foreground"
            >
              Close
            </button>
          </div>
        </div>))
    }
  }, [])


  // const callAgent = useCallback(async () => {
  //   const data = await getAnswer()
  //   console.log(data)
  // }, [])
  // useEffect(() => {
  //   callAgent()
  // }, [callAgent])


  if (!isClient) return null;
  const overlayStyle = {
    background: 'linear-gradient(180deg, rgba(0,0,0,0.65), rgba(0,0,0,0.55))',
    WebkitBackdropFilter: 'blur(6px) saturate(120%)', // Safari prefix
    backdropFilter: 'blur(6px) saturate(120%)',
    // radial-gradient mask: center is solid (keeps contrast), edges fade to transparent
    WebkitMaskImage: 'radial-gradient(circle at 50% 20%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0) 100%)',
    maskImage: 'radial-gradient(circle at 50% 20%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0) 100%)',
  }
  return (
    <BackgroundSelector>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <div className="m-0 p-0 sm:p-8 md:p-12 flex justify-center items-center">
        <div className="w-full sm:w-[600px] min-w-[100px] flex-shrink-0 max-w-[90vw] mx-auto p-1">
          <div className="w-full flex flex-col gap-8 p-1 relative overflow-hidden rounded-2xl">
            <div className="absolute inset-0 z-10 pointer-events-none"
              style={overlayStyle}
              aria-hidden="true"
            />
            <div className="relative z-20 flex flex-col gap-8 bg-black/60 p-4 rounded-xl">
              <Header setIsLoading={setIsLoading} />
              <Contacts />
              <Experiences />
              <Projects />
              <Skills />
              <Blogs setIsLoading={setIsLoading} />
            </div>
          </div>
        </div>
      </div >
      {isLoading &&
        <Loader />
      }
    </BackgroundSelector >
  )
}
