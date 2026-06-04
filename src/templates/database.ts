import type { Database, Language } from '../types.js'

type DbTemplateSet = Record<Language, string>

const dbTemplates: Record<Exclude<Database, 'none'>, DbTemplateSet> = {
  mongodb: {
    typescript: `import mongoose from 'mongoose'

export async function connectDatabase(): Promise<void> {
  const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017/__PROJECT_NAME__'
  await mongoose.connect(uri)
  console.log('Connected to MongoDB')
}
`,
    javascript: `import mongoose from 'mongoose'

export async function connectDatabase() {
  const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017/__PROJECT_NAME__'
  await mongoose.connect(uri)
  console.log('Connected to MongoDB')
}
`,
  },
  postgresql: {
    typescript: `import pg from 'pg'

const { Pool } = pg

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/__PROJECT_NAME__',
})

export async function query(text: string, params?: unknown[]) {
  const result = await pool.query(text, params)
  return result
}
`,
    javascript: `import pg from 'pg'

const { Pool } = pg

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/__PROJECT_NAME__',
})

export async function query(text, params) {
  const result = await pool.query(text, params)
  return result
}
`,
  },
  mysql: {
    typescript: `import mysql from 'mysql2/promise'

export async function connectDatabase(): Promise<mysql.Connection> {
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL || 'mysql://localhost:3306/__PROJECT_NAME__',
  })
  console.log('Connected to MySQL')
  return connection
}
`,
    javascript: `import mysql from 'mysql2/promise'

export async function connectDatabase() {
  const connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL || 'mysql://localhost:3306/__PROJECT_NAME__',
  })
  console.log('Connected to MySQL')
  return connection
}
`,
  },
  sqlite: {
    typescript: `import Database from 'better-sqlite3'
import { join } from 'node:path'

const dbPath = process.env.DATABASE_URL || join(process.cwd(), '__PROJECT_NAME__.db')
export const db = new Database(dbPath)

export function connectDatabase(): void {
  db.pragma('journal_mode = WAL')
  console.log('Connected to SQLite')
}
`,
    javascript: `import Database from 'better-sqlite3'
import { join } from 'node:path'

const dbPath = process.env.DATABASE_URL || join(process.cwd(), '__PROJECT_NAME__.db')
export const db = new Database(dbPath)

export function connectDatabase() {
  db.pragma('journal_mode = WAL')
  console.log('Connected to SQLite')
}
`,
  },
  mariadb: {
    typescript: `import mariadb from 'mariadb'

export const pool = mariadb.createPool({
  connectionLimit: 5,
  uri: process.env.DATABASE_URL || 'mariadb://localhost:3306/__PROJECT_NAME__',
})

export async function connectDatabase(): Promise<void> {
  const conn = await pool.getConnection()
  conn.release()
  console.log('Connected to MariaDB')
}
`,
    javascript: `import mariadb from 'mariadb'

export const pool = mariadb.createPool({
  connectionLimit: 5,
  uri: process.env.DATABASE_URL || 'mariadb://localhost:3306/__PROJECT_NAME__',
})

export async function connectDatabase() {
  const conn = await pool.getConnection()
  conn.release()
  console.log('Connected to MariaDB')
}
`,
  },
  sqlserver: {
    typescript: `import sql from 'mssql'

const config: sql.config = {
  connectionString: process.env.DATABASE_URL || 'sqlserver://localhost:1433;database=__PROJECT_NAME__;trustServerCertificate=true',
}

export async function connectDatabase(): Promise<void> {
  await sql.connect(config)
  console.log('Connected to SQL Server')
}
`,
    javascript: `import sql from 'mssql'

const config = {
  connectionString: process.env.DATABASE_URL || 'sqlserver://localhost:1433;database=__PROJECT_NAME__;trustServerCertificate=true',
}

export async function connectDatabase() {
  await sql.connect(config)
  console.log('Connected to SQL Server')
}
`,
  },
  redis: {
    typescript: `import Redis from 'ioredis'

export const redis = new Redis(process.env.DATABASE_URL || 'redis://localhost:6379')

export async function connectDatabase(): Promise<void> {
  await redis.ping()
  console.log('Connected to Redis')
}
`,
    javascript: `import Redis from 'ioredis'

export const redis = new Redis(process.env.DATABASE_URL || 'redis://localhost:6379')

export async function connectDatabase() {
  await redis.ping()
  console.log('Connected to Redis')
}
`,
  },
}

export const dbMeta: Record<
  Database,
  { dependencies: Record<string, string>; devDependencies?: Record<string, string>; envUrl: string }
> = {
  none: { dependencies: {}, envUrl: '' },
  mongodb: {
    dependencies: { mongoose: '^8.0.0' },
    envUrl: 'mongodb://localhost:27017/__PROJECT_NAME__',
  },
  postgresql: {
    dependencies: { pg: '^8.13.0' },
    devDependencies: { '@types/pg': '^8.11.0' },
    envUrl: 'postgresql://localhost:5432/__PROJECT_NAME__',
  },
  mysql: {
    dependencies: { mysql2: '^3.11.0' },
    envUrl: 'mysql://localhost:3306/__PROJECT_NAME__',
  },
  sqlite: {
    dependencies: { 'better-sqlite3': '^11.0.0' },
    devDependencies: { '@types/better-sqlite3': '^7.6.0' },
    envUrl: './__PROJECT_NAME__.db',
  },
  mariadb: {
    dependencies: { mariadb: '^3.4.0' },
    envUrl: 'mariadb://localhost:3306/__PROJECT_NAME__',
  },
  sqlserver: {
    dependencies: { mssql: '^11.0.0' },
    devDependencies: { '@types/mssql': '^9.1.0' },
    envUrl: 'sqlserver://localhost:1433;database=__PROJECT_NAME__;trustServerCertificate=true',
  },
  redis: {
    dependencies: { ioredis: '^5.4.0' },
    envUrl: 'redis://localhost:6379',
  },
}

export function getDatabaseFiles(language: Language, databases: Database[]): Record<string, string> {
  const active = databases.filter((d) => d !== 'none')
  if (active.length === 0) return {}
  const ext = language === 'typescript' ? 'ts' : 'js'

  const files: Record<string, string> = {}
  for (const db of active) {
    const fileName = active.length === 1 ? 'index' : db
    files[`src/db/${fileName}.${ext}`] = dbTemplates[db][language]
  }
  return files
}

export function getDatabaseMeta(databases: Database[]) {
  const active = databases.filter((d) => d !== 'none')
  if (active.length === 0) return { dependencies: {}, devDependencies: undefined, envUrl: '' }

  const result = {
    dependencies: {} as Record<string, string>,
    devDependencies: {} as Record<string, string> | undefined,
    envUrl: '',
  }

  for (const db of active) {
    const meta = dbMeta[db]
    Object.assign(result.dependencies, meta.dependencies)
    if (meta.devDependencies) {
      if (!result.devDependencies) result.devDependencies = {}
      Object.assign(result.devDependencies, meta.devDependencies)
    }
  }

  return result
}
