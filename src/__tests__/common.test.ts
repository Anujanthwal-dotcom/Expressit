import { describe, expect, it } from 'vitest'
import { commonTemplate, getDockerComposeServices, pmCommands } from '../templates/common.js'

describe('commonTemplate', () => {
  it('contains required files', () => {
    expect(commonTemplate).toHaveProperty('.gitignore')
    expect(commonTemplate).toHaveProperty('.env')
    expect(commonTemplate).toHaveProperty('.env.example')
    expect(commonTemplate).toHaveProperty('.dockerignore')
    expect(commonTemplate).toHaveProperty('Dockerfile')
    expect(commonTemplate).toHaveProperty('docker-compose.yml')
    expect(commonTemplate).toHaveProperty('README.md')
  })

  it('has PM placeholders in Dockerfile', () => {
    expect(commonTemplate.Dockerfile).toContain('__PM_INSTALL__')
    expect(commonTemplate.Dockerfile).toContain('__PM__')
  })

  it('has PM placeholder in docker-compose.yml', () => {
    expect(commonTemplate['docker-compose.yml']).toContain('__PM_DEV__')
  })
})

describe('pmCommands', () => {
  it('provides commands for all package managers', () => {
    expect(pmCommands).toHaveProperty('npm')
    expect(pmCommands).toHaveProperty('yarn')
    expect(pmCommands).toHaveProperty('pnpm')
    expect(pmCommands).toHaveProperty('bun')
  })

  it('generates correct npm commands', () => {
    const npm = pmCommands.npm
    expect(npm.install).toBe('npm install')
    expect(npm.dev).toBe('npm run dev')
    expect(npm.start).toBe('npm start')
  })

  it('generates correct yarn commands', () => {
    const yarn = pmCommands.yarn
    expect(yarn.install).toBe('yarn')
    expect(yarn.dev).toBe('yarn dev')
    expect(yarn.start).toBe('yarn start')
  })

  it('generates correct pnpm commands', () => {
    const pnpm = pmCommands.pnpm
    expect(pnpm.install).toBe('pnpm install')
    expect(pnpm.dev).toBe('pnpm dev')
  })

  it('generates correct bun commands', () => {
    const bun = pmCommands.bun
    expect(bun.install).toBe('bun install')
    expect(bun.dev).toBe('bun run dev')
  })
})

describe('getDockerComposeServices', () => {
  it('returns empty string when no databases selected', () => {
    expect(getDockerComposeServices(['none'])).toBe('')
  })

  it('includes service for mongodb', () => {
    const result = getDockerComposeServices(['mongodb'])
    expect(result).toContain('mongodb:')
    expect(result).toContain('image: mongo:7')
    expect(result).toContain('mongodb_data:')
  })

  it('includes service for postgresql', () => {
    const result = getDockerComposeServices(['postgresql'])
    expect(result).toContain('postgresql:')
    expect(result).toContain('image: postgres:16')
    expect(result).toContain('postgresql_data:')
  })

  it('includes multiple services and deduplicates volumes', () => {
    const result = getDockerComposeServices(['mongodb', 'redis'])
    expect(result).toContain('mongodb:')
    expect(result).toContain('redis:')
    expect(result).toContain('mongodb_data:')
    expect(result).toContain('redis_data:')
  })

  it('uses __PROJECT_NAME__ placeholder in env vars', () => {
    const result = getDockerComposeServices(['postgresql'])
    expect(result).toContain('__PROJECT_NAME__')
  })
})
