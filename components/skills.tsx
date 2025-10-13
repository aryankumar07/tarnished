import { skillInfo } from "../constants/data"
import DropDown from "./dropdown"

const Skills = () => {
  return (
    <div className="flex flex-col justify-start items-start gap-4 select-none">
      <div className="text-foreground/50">Skills</div>
      {
        skillInfo.map((skill) => (
          <DropDown key={skill.heading.title} data={skill} />
        ))
      }
    </div>
  )
}

export default Skills
