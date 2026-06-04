import { describe, expect, it } from 'vitest'
import { validateProjectName } from '../utils/validateProjectName.js'

describe('validateProjectName', () => {
  it('accepts valid project names', () => {
    expect(validateProjectName('my-app')).toBe(true)
    expect(validateProjectName('my_app')).toBe(true)
    expect(validateProjectName('myapp')).toBe(true)
    expect(validateProjectName('my.app')).toBe(true)
    expect(validateProjectName('a')).toBe(true)
  })

  it('accepts dot as project name', () => {
    expect(validateProjectName('.')).toBe(true)
  })

  it('rejects empty names', () => {
    expect(validateProjectName('')).toBe('Project name cannot be empty')
  })

  it('rejects names starting with non-letter', () => {
    expect(validateProjectName('1-app')).toBe('Project name must start with a letter')
    expect(validateProjectName('-app')).toBe('Project name must start with a letter')
  })

  it('rejects names with invalid characters', () => {
    expect(validateProjectName('my app')).toBe(
      'Project name can only contain letters, numbers, dots, hyphens, underscores, and @',
    )
    expect(validateProjectName('my$app')).toBe(
      'Project name can only contain letters, numbers, dots, hyphens, underscores, and @',
    )
  })

  it('rejects names exceeding 214 characters', () => {
    expect(validateProjectName('a'.repeat(215))).toBe('Project name is too long (max 214 characters)')
  })
})
