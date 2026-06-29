export function getFirstWord(str: string): string {
  return str.trim().split(/\s+/)[0] ?? ''
}
