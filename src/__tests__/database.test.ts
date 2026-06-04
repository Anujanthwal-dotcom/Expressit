import { describe, expect, it } from 'vitest'
import { getDatabaseFiles, getDatabaseMeta } from '../templates/database.js'

describe('getDatabaseFiles', () => {
  it('returns empty object when no databases selected', () => {
    expect(getDatabaseFiles('typescript', ['none'])).toEqual({})
  })

  it('returns index file for single database', () => {
    const files = getDatabaseFiles('typescript', ['mongodb'])
    expect(files).toHaveProperty('src/db/index.ts')
    expect(files['src/db/index.ts']).toContain('mongoose')
  })

  it('returns named files for multiple databases', () => {
    const files = getDatabaseFiles('javascript', ['mongodb', 'redis'])
    expect(files).toHaveProperty('src/db/mongodb.js')
    expect(files).toHaveProperty('src/db/redis.js')
    expect(files['src/db/mongodb.js']).toContain('mongoose')
    expect(files['src/db/redis.js']).toContain('ioredis')
  })

  it('returns .ts extension for TypeScript', () => {
    const files = getDatabaseFiles('typescript', ['postgresql'])
    expect(files).toHaveProperty('src/db/index.ts')
  })

  it('returns .js extension for JavaScript', () => {
    const files = getDatabaseFiles('javascript', ['postgresql'])
    expect(files).toHaveProperty('src/db/index.js')
  })
})

describe('getDatabaseMeta', () => {
  it('returns empty deps when no databases selected', () => {
    const meta = getDatabaseMeta(['none'])
    expect(meta.dependencies).toEqual({})
  })

  it('returns dependencies for selected databases', () => {
    const meta = getDatabaseMeta(['mongodb'])
    expect(meta.dependencies).toHaveProperty('mongoose')
  })

  it('merges dependencies for multiple databases', () => {
    const meta = getDatabaseMeta(['mongodb', 'redis'])
    expect(meta.dependencies).toHaveProperty('mongoose')
    expect(meta.dependencies).toHaveProperty('ioredis')
  })

  it('includes devDependencies when applicable', () => {
    const meta = getDatabaseMeta(['postgresql'])
    expect(meta.devDependencies).toHaveProperty('@types/pg')
  })
})
