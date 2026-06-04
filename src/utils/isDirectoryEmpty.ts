import { readdir } from 'node:fs/promises'

export async function isDirectoryEmpty(dirPath: string): Promise<boolean> {
  try {
    const files = await readdir(dirPath)
    return files.length === 0
  } catch {
    return true
  }
}
