import type { KeyBinding } from '../../types/keymap'

import {
  corneQwertyBase,
  corneShiftLayer,
  corneSymbolLayer,
  corneNumberLayer,
  corneNavLayer,
} from './basic'

import { corne3x5Base, corne3x5Shift, corne3x5Lower, corne3x5Raise, corne3x5Nav } from './corne3x5'

import { sweepBase, sweepShift, sweepLower, sweepRaise, sweepNav } from './sweep'

import { lily58Base, lily58Shift, lily58Lower, lily58Raise, lily58Nav } from './lily58'

import { planckBase, planckShift, planckLower, planckRaise } from './planck'

import { kyriaBase, kyriaShift, kyriaLower, kyriaRaise, kyriaNav } from './kyria'

import { ansi60Base, ansi60Shift, ansi60Fn } from './ansi60'

import { ansiTklBase, ansiTklShift, ansiTklFn } from './ansiTkl'

import { irisBase, irisShift, irisLower, irisRaise, irisNav } from './iris'

export interface DefaultLayerData {
  name: string
  bindings: KeyBinding[]
}

export interface DefaultKeymapData {
  layers: DefaultLayerData[]
}

const registry: Record<string, DefaultKeymapData> = {
  'corne-3x6': {
    layers: [
      { name: 'Base', bindings: corneQwertyBase },
      { name: 'Shift', bindings: corneShiftLayer },
      { name: 'Symbols', bindings: corneSymbolLayer },
      { name: 'Numbers', bindings: corneNumberLayer },
      { name: 'Nav', bindings: corneNavLayer },
    ],
  },
  'corne-3x5': {
    layers: [
      { name: 'Base', bindings: corne3x5Base },
      { name: 'Shift', bindings: corne3x5Shift },
      { name: 'Lower', bindings: corne3x5Lower },
      { name: 'Raise', bindings: corne3x5Raise },
      { name: 'Nav', bindings: corne3x5Nav },
    ],
  },
  sweep: {
    layers: [
      { name: 'Base', bindings: sweepBase },
      { name: 'Shift', bindings: sweepShift },
      { name: 'Lower', bindings: sweepLower },
      { name: 'Raise', bindings: sweepRaise },
      { name: 'Nav', bindings: sweepNav },
    ],
  },
  lily58: {
    layers: [
      { name: 'Base', bindings: lily58Base },
      { name: 'Shift', bindings: lily58Shift },
      { name: 'Lower', bindings: lily58Lower },
      { name: 'Raise', bindings: lily58Raise },
      { name: 'Nav', bindings: lily58Nav },
    ],
  },
  planck: {
    layers: [
      { name: 'Base', bindings: planckBase },
      { name: 'Shift', bindings: planckShift },
      { name: 'Lower', bindings: planckLower },
      { name: 'Raise', bindings: planckRaise },
    ],
  },
  kyria: {
    layers: [
      { name: 'Base', bindings: kyriaBase },
      { name: 'Shift', bindings: kyriaShift },
      { name: 'Lower', bindings: kyriaLower },
      { name: 'Raise', bindings: kyriaRaise },
      { name: 'Nav', bindings: kyriaNav },
    ],
  },
  'ansi-60': {
    layers: [
      { name: 'Base', bindings: ansi60Base },
      { name: 'Shift', bindings: ansi60Shift },
      { name: 'Fn', bindings: ansi60Fn },
    ],
  },
  'ansi-tkl': {
    layers: [
      { name: 'Base', bindings: ansiTklBase },
      { name: 'Shift', bindings: ansiTklShift },
      { name: 'Fn', bindings: ansiTklFn },
    ],
  },
  iris: {
    layers: [
      { name: 'Base', bindings: irisBase },
      { name: 'Shift', bindings: irisShift },
      { name: 'Lower', bindings: irisLower },
      { name: 'Raise', bindings: irisRaise },
      { name: 'Nav', bindings: irisNav },
    ],
  },
}

export function getDefaultKeymapData(layoutId: string): DefaultKeymapData | null {
  return registry[layoutId] ?? null
}
