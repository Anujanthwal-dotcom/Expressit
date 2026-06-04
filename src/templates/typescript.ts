export const typescriptTemplate: Record<string, string> = {
  'package.json': `{
  "name": "__PROJECT_NAME__",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "start": "tsx src/index.ts",
    "build": "tsc",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.21.0",
    "helmet": "^8.0.0",
    "pino": "^9.0.0"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^5.0.0",
    "@types/node": "^22.0.0",
    "pino-pretty": "^13.0.0",
    "tsx": "^4.19.0",
    "typescript": "^5.7.0"
  }
}
`,
  'tsconfig.json': `{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
`,
  'src/index.ts': `import { app } from './app.js'
import { config } from './config/index.js'

app.listen(config.port, () => {
  config.logger.info(\`Server running on http://localhost:\${config.port}\`)
})
`,
  'src/app.ts': `import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { router } from './routes/index.js'
import { config } from './config/index.js'
import { errorHandler } from './middleware/index.js'
import type { Request, Response } from 'express'

const app = express()

app.use(helmet())
app.use(cors({ origin: config.corsOrigins }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/', router)

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Not Found' })
})

app.use(errorHandler)

export { app }
`,
  'src/config/index.ts': `import pino from 'pino'

const isProduction = process.env.NODE_ENV === 'production'

export const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction,
  isDevelopment: !isProduction,
  corsOrigins: process.env.CORS_ORIGINS || '*',
  logLevel: process.env.LOG_LEVEL || 'info',
  logger: pino({
    level: process.env.LOG_LEVEL || 'info',
    ...(isProduction ? {} : { transport: { target: 'pino-pretty' } }),
  }),
}
`,
  'src/middleware/index.ts': `import { type Request, type Response, type NextFunction } from 'express'
import { config } from '../config/index.js'

export function errorHandler(
  err: Error & { status?: number },
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  config.logger.error(err, 'Unhandled error')
  res.status(err.status || 500).json({
    message: config.isProduction ? 'Internal Server Error' : err.message,
    ...(config.isProduction ? {} : { stack: err.stack }),
  })
}
`,
  'src/routes/index.ts': `import { Router } from 'express'
import { getHello } from '../controllers/index.js'

const router = Router()

router.get('/', getHello)

export { router }
`,
  'src/controllers/index.ts': `import { type Request, type Response } from 'express'

export function getHello(_req: Request, res: Response) {
  res.json({ message: 'Hello from Expressit!' })
}
`,
  'src/types/index.ts': `export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}
`,
}
