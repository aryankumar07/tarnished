import { ProjectInfo } from "../constants/data"
import LinkPremative from "./link-premative"
import SoundComponent from "./soundComponent"


const Projects = () => {


  return (
    <div className="flex flex-col gap-4 justify-start items-start select-none">
      <h1 className="text-foreground/50">Projects</h1>
      <div className="flex flex-col gap-6 justify-start items-start">
        {
          ProjectInfo.map((info) => {
            return (
              <div key={info.title} className="flex flex-col items-start justify-start gap-1">
                <p>
                  <SoundComponent
                    href="/sounds/hover.mp3"
                    render={(handlePlay) => (
                      <LinkPremative href={info.LiveLink!} external>
                        <span onMouseEnter={handlePlay} className="underline decoration-orange hover:text-black hover:bg-orange hover:cursor-pointer">{info.title}:</span>
                      </LinkPremative>
                    )}
                  />
                  {info.Content}
                </p>
                <div className="flex justify-center items-center gap-5">

                  <LinkPremative
                    href={info.LiveLink!}
                    external
                  >
                    <div className="flex justify-center items-center gap-2">
                      <h1>Live</h1>
                      <div className="bg-orange">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right-icon lucide-arrow-up-right"><path d="M7 7h10v10" /><path d="M7 17 17 7" /></svg>
                      </div>
                    </div>
                  </LinkPremative>

                  <LinkPremative
                    href={info.GithubLink!}
                    external
                  >
                    <div className="flex justify-center items-center gap-2">
                      <h1>Code</h1>
                      <div className="bg-orange">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right-icon lucide-arrow-up-right"><path d="M7 7h10v10" /><path d="M7 17 17 7" /></svg>
                      </div>
                    </div>
                  </LinkPremative>

                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Projects
