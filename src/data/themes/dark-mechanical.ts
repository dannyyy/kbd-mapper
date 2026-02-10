import type { Theme } from '../../types/theme'

export const darkMechanical: Theme = {
  id: 'dark-mechanical',
  name: 'Dark Mechanical',
  colors: {
    background: '#1a1d23',
    keyDefault: {
      fill: '#2d3139',
      stroke: '#3d424d',
      textColor: '#e5e7eb',
      strokeWidth: 1.5,
      borderRadius: 5,
      opacity: 1,
    },
    keyStyles: {
      modifier: {
        fill: '#3b4252',
        stroke: '#7b8ba3',
        textColor: '#93c5fd',
        strokeWidth: 1.5,
      },
      'layer-toggle': {
        fill: '#312e81',
        stroke: '#818cf8',
        textColor: '#c4b5fd',
        strokeWidth: 2,
      },
      'layer-tap': {
        fill: '#0c4a6e',
        stroke: '#0ea5e9',
        textColor: '#7dd3fc',
        strokeWidth: 1.5,
      },
      'mod-tap': {
        fill: '#422006',
        stroke: '#eab308',
        textColor: '#fde047',
        strokeWidth: 1.5,
      },
      transparent: {
        fill: '#1f2228',
        stroke: '#4b5563',
        textColor: '#6b7280',
        strokeWidth: 1.5,
        strokeDasharray: '4 2',
        opacity: 0.85,
      },
      none: {
        fill: '#1a1d23',
        stroke: '#4b5563',
        textColor: '#4b5563',
        strokeWidth: 1,
        strokeDasharray: '2 2',
        opacity: 0.7,
      },
      function: {
        fill: '#3b1323',
        stroke: '#f87171',
        textColor: '#fca5a5',
        strokeWidth: 1.5,
      },
      navigation: {
        fill: '#064e3b',
        stroke: '#34d399',
        textColor: '#6ee7b7',
        strokeWidth: 1.5,
      },
      media: {
        fill: '#431407',
        stroke: '#fb923c',
        textColor: '#fdba74',
        strokeWidth: 1.5,
      },
    },
    layerLabelColors: ['#818cf8', '#fbbf24', '#34d399', '#f87171', '#a78bfa', '#22d3ee', '#fb923c', '#f472b6'],
    legendColors: {
      primary: '#e5e7eb',
      secondary: '#9ca3af',
      hold: '#c084fc',
    },
  },
  typography: {
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    primaryLabelSize: 11,
    secondaryLabelSize: 7.5,
    holdLabelSize: 6.5,
  },
  layout: {
    keyUnit: 54,
    keyPadding: 6,
    keyGap: 4,
    borderRadius: 5,
    splitGap: 30,
  },
  source: 'builtin',
}
