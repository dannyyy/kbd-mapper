let counter = 0

export function generateId(prefix = ''): string {
  counter++
  const rand = Math.random().toString(36).substring(2, 8)
  return `${prefix}${prefix ? '-' : ''}${Date.now().toString(36)}-${rand}-${counter}`
}
