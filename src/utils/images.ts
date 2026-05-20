export function getFileUrl(file?: string | null): string {
  if (!file) return ''
  if (file.startsWith('http://') || file.startsWith('https://')) return file
  return `${import.meta.env.VITE_FILES_BASE_URL}${file}`
}


