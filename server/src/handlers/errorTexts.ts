export const duplicateInsertError = (keyValue: Record<string, string>): string => {
  const entries = Object.entries(keyValue)
  return `record with key:${entries[0][0]} and value:${entries[0][1]} already exists`
}