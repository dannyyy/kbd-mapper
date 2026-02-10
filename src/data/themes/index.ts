import type { Theme } from '../../types/theme'
import { cleanLight } from './clean-light'
import { darkMechanical } from './dark-mechanical'
import { warmPaper } from './warm-paper'
import { colorful } from './colorful'
import { highContrast } from './high-contrast'

export const builtinThemes: Theme[] = [
  cleanLight,
  darkMechanical,
  warmPaper,
  colorful,
  highContrast,
]

export const themeMap = new Map<string, Theme>(
  builtinThemes.map(t => [t.id, t])
)

export { cleanLight, darkMechanical, warmPaper, colorful, highContrast }
