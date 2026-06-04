const INVALID_CHARS = /[^a-z0-9@._-]/i

const MAX_LENGTH = 214

export function validateProjectName(name: string): true | string {
  if (!name || name.trim() === '') {
    return 'Project name cannot be empty'
  }

  if (name === '.') return true

  if (name.length > MAX_LENGTH) {
    return `Project name is too long (max ${MAX_LENGTH} characters)`
  }

  if (INVALID_CHARS.test(name)) {
    return 'Project name can only contain letters, numbers, dots, hyphens, underscores, and @'
  }

  if (/^[^a-zA-Z]/.test(name)) {
    return 'Project name must start with a letter'
  }

  return true
}
