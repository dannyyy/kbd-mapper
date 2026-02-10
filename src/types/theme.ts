import type { KeyType } from './keymap'

export interface KeyStyle {
  fill: string
  stroke: string
  textColor: string
  strokeWidth?: number
  strokeDasharray?: string
  borderRadius?: number
  opacity?: number
}

export interface Theme {
  id: string
  name: string
  colors: {
    background: string
    keyDefault: KeyStyle
    keyStyles: Partial<Record<KeyType, KeyStyle>>
    layerLabelColors: string[]
    legendColors: {
      primary: string
      secondary: string
      hold: string
    }
  }
  typography: {
    fontFamily: string
    primaryLabelSize: number
    secondaryLabelSize: number
    holdLabelSize: number
  }
  layout: {
    keyUnit: number
    keyPadding: number
    keyGap: number
    borderRadius: number
    splitGap: number
  }
  source: 'builtin' | 'user'
}
