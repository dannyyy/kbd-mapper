import { ref, onMounted, onUnmounted } from 'vue'

const isMobileLandscape = ref(false)
const isMobilePortrait = ref(false)

let initialized = false
let mediaQueryLandscape: MediaQueryList | null = null
let mediaQueryPortrait: MediaQueryList | null = null

function update() {
  if (mediaQueryLandscape) {
    isMobileLandscape.value = mediaQueryLandscape.matches
  }
  if (mediaQueryPortrait) {
    isMobilePortrait.value = mediaQueryPortrait.matches
  }
}

/**
 * Reactive mobile detection.
 * - isMobileLandscape: coarse pointer + limited height (phone in landscape)
 * - isMobilePortrait: narrow viewport in portrait (show rotation prompt)
 */
export function useMobile() {
  onMounted(() => {
    if (!initialized) {
      mediaQueryLandscape = window.matchMedia(
        '(pointer: coarse) and (max-height: 500px) and (orientation: landscape)',
      )
      mediaQueryPortrait = window.matchMedia(
        '(pointer: coarse) and (max-width: 600px) and (orientation: portrait)',
      )
      update()
      mediaQueryLandscape.addEventListener('change', update)
      mediaQueryPortrait.addEventListener('change', update)
      initialized = true
    } else {
      update()
    }
  })

  onUnmounted(() => {
    // Keep listeners alive — they're shared singletons
  })

  return { isMobileLandscape, isMobilePortrait }
}
