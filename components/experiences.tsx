import DropDown from "./dropdown"
import { expInfo } from "../constants/data"

const Experiences = () => {

  return (
    <div className="flex flex-col justify-start items-start gap-1 select-none">
      <h1 className="text-foreground/50">Experiences</h1>
      {
        expInfo.map((data) => {
          return (
            <DropDown key={data.heading.title} data={data} />
          )
        })
      }
    </div>
  )
}

export default Experiences
