'use client'
import { BackgroundSelector } from "../../components/background_selector"
import { useState, useEffect } from "react"
import Header from "../../components/header"
import gsap from "gsap"
import { useGSAP } from "@gsap/react";
import Contacts from "../../components/contacts"
import Experiences from "../../components/experiences"
import Projects from "../../components/projects"


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
        <div className="w-full h-auto min-w-[50px] sm:max-w-[35vw] p-1">
          <div className="w-full flex flex-col gap-8">
            <Header />
            <Contacts />
            <Experiences />
            <Projects />
          </div>
        </div>
      </div >
    </BackgroundSelector >
  )
}
