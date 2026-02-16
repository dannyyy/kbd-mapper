import type { PhysicalLayout } from '../../types/layout'
import { corne3x6 } from './corne-3x6'
import { corne3x5 } from './corne-3x5'
import { sweep } from './sweep'
import { lily58 } from './lily58'
import { planck } from './planck'
import { ansi60 } from './ansi-60'
import { ansiTkl } from './ansi-tkl'
import { kyria } from './kyria'
import { irisSe } from './iris-se'
import { irisCe } from './iris-ce'
import { irisLm } from './iris-lm'

export const builtinLayouts: PhysicalLayout[] = [
  corne3x6,
  corne3x5,
  sweep,
  lily58,
  planck,
  ansi60,
  ansiTkl,
  kyria,
  irisSe,
  irisCe,
  irisLm,
]

export const layoutMap = new Map<string, PhysicalLayout>(builtinLayouts.map((l) => [l.id, l]))

export { corne3x6, corne3x5, sweep, lily58, planck, ansi60, ansiTkl, kyria, irisSe, irisCe, irisLm }
