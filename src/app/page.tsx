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


gsap.registerPlugin(useGSAP);
export default function Home() {

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])


  if (!isClient) return;


  return (
    <BackgroundSelector>
      <div className="m-0 p-0 sm:p-8 md:p-12 flex justify-center items-center">
        <div className="w-full sm:w-[500px] min-w-[100px] flex-shrink-0 max-w-[90vw] mx-auto p-1">
          <div className="w-full flex flex-col gap-8">
            <Header />
            <Contacts />
            <Experiences />
            <Projects />
            <Skills />
            <Blogs />
          </div>
        </div>
      </div >
    </BackgroundSelector >
  )
}
