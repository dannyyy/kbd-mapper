export interface KeyPosition {
  x: number
  y: number
  w?: number
  h?: number
  r?: number
  rx?: number
  ry?: number
}

export interface PhysicalLayout {
  id: string
  name: string
  keys: KeyPosition[]
  splits?: number[]
  metadata: {
    source: 'builtin' | 'user'
    tags?: string[]
  }
}
