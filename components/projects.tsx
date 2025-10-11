import { ProjectInfo } from "../constants/data"
import LinkPremative from "./link-premative"
import SoundComponent from "./soundComponent"


const Projects = () => {


  return (
    <div className="flex flex-col gap-4 justify-start items-start">
      <h1 className="text-foreground/50">Projects</h1>
      <div className="flex flex-col gap-6 justify-start items-start">
        {
          ProjectInfo.map((info) => {
            return (
              <div key={info.title} className="text-justify">
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
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Projects
