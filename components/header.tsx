import { useGSAP } from "@gsap/react";
import gsap from 'gsap'
import LinkPremative from "./link-premative";
import SoundComponent from "./soundComponent";
import { useState } from "react";
import { useRouter } from "next/navigation";


const Header = ({
  setIsLoading
}: {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}) => {

  const router = useRouter()

  useGSAP(() => {
    gsap.to('#blink', {
      opacity: 0,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    })
  }, [])


  const handleNavigation = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      router.push('/me')
    }, 800)
  }


  const [copied, setCopied] = useState<boolean>(false)

  const handleCopy = (text: string, handlePlay: () => void) => {
    handlePlay()
    setTimeout(() => {
      setCopied(false)
    }, 2000)
    navigator.clipboard.writeText(text)
    setCopied(true)
  }

  return (
    <div className="w-full flex flex-col gap-3 select-none">

      <div className="flex justify-start items-center gap-2">
        <div id="blink" className="rounded-full h-2 w-2 bg-orange"></div>
        <h1 className="text-3xl">Aryan</h1>
      </div>

      <p className="text-light-foreground/50 text-md">Software Engineer,Indie Developer</p>

      <div className="text-justify" >A passionate software engineer, Writing code like digital poet, tirelessly crafting solutions that spark innovation and bring ideas to life with relentless curiosity and precision. Always happy for a
        <LinkPremative href='https://twitter.com/messages/compose?recipient_id=1760429731135021056' external >
          <SoundComponent
            href={'/sounds/hover.mp3'}
            render={(handlePlay) => (
              <span onMouseEnter={handlePlay} className="hover:bg-orange underline hover:text-black"> conversation</span>
            )}
          />
        </LinkPremative>
      </div>

      <div className="flex w-auto gap-5">
        <button onClick={handleNavigation} className="flex justify-center items-center gap-1 border-[0.3px] p-1 border-light-foreground/50 text-foreground/30 text-sm hover:bg-orange hover:border-light-foreground hover:text-black hover:cursor-pointer">
          Know More About Me<span><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right-icon lucide-arrow-right"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg></span>
        </button>
        <SoundComponent
          href="/sounds/copied.mp3"
          render={(handlePlay) => (
            <button onClick={() => handleCopy('aryan.pageme@gmail.com', handlePlay)} className="group flex items-center gap-2 cursor-pointer text-foreground/50">
              {copied ? "Email Copied to Clipboard" : "Email Me"}
              <span className="opacity-0 group-hover:opacity-100 group-hover:bg-orange p-0.5 group-hover:text-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail-icon lucide-mail"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" /><rect x="2" y="4" width="20" height="16" rx="2" /></svg>
              </span>
            </button>
          )}
        />
      </div>

    </div>
  )
}

export default Header
