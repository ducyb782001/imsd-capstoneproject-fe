import { listVariable } from "../constants/globalCssVariable"

/**
 * Change skeleton color by theme
 * @param theme Matches with device'theme, 'dark' || 'light'
 */
export const changeSkeletonColor = (theme: string) => {
  const rootElement = document.documentElement

  for (let i = 0; i < listVariable.length; i++) {
    rootElement.style.setProperty(listVariable[i].name, listVariable[i][theme])
  }
}
