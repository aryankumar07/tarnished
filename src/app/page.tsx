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

// import ScrollTrigger from "gsap/ScrollTrigger"; 
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
          className={`${t.visible ? "animate-custom-enter" : "animate-custom-leave"} max-w-md w-full bg-gray-900 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-50 border border-gray-800`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                {/* Accent icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-6 w-6 text-indigo-400"
                  aria-hidden
                >
                  <path d="M12 2v6" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 22v-6" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4.93 4.93l4.24 4.24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18.07 19.07l-4.24-4.24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>


              <div className="ml-3 flex-1">
                <div className="text-sm font-medium text-gray-100">Watch for some easter eggs</div>
                <div className="mt-1 text-xs text-gray-400">Tap around — surprises are hidden in the UI.</div>
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-800">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-300 hover:text-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              Close
            </button>
          </div>
        </div>))
    }

  }, [])

  if (!isClient) return null;

  return (
    <BackgroundSelector>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <div className="m-0 p-0 sm:p-8 md:p-12 flex justify-center items-center">
        <div className="w-full sm:w-[500px] min-w-[100px] flex-shrink-0 max-w-[90vw] mx-auto p-1">
          <div className="w-full flex flex-col gap-8">
            <Header setIsLoading={setIsLoading} />
            <Contacts />
            <Experiences />
            <Projects />
            <Skills />
            <Blogs />
          </div>
        </div>
      </div >
      {isLoading &&
        <Loader />
      }
    </BackgroundSelector >
  )
}
