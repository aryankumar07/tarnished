import { BACKGROUNDS } from "../constants/backgrounds"
import { isProduction } from "./env"

export const getbackground = () => {
  if (isProduction()) {
    const index = Math.floor(Math.random() * BACKGROUNDS.length);
    return BACKGROUNDS[index]
  }
  return BACKGROUNDS[BACKGROUNDS.length - 1]
}
