export const javascriptTemplate: Record<string, string> = {
  'package.json': `{
  "name": "__PROJECT_NAME__",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "node --watch src/index.js",
    "start": "node src/index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.21.0",
    "helmet": "^8.0.0",
    "pino": "^9.0.0"
  },
  "devDependencies": {
    "pino-pretty": "^13.0.0"
  }
}
`,
  'src/index.js': `import { app } from './app.js'
import { config } from './config/index.js'

app.listen(config.port, () => {
  config.logger.info(\`Server running on http://localhost:\${config.port}\`)
})
`,
  'src/app.js': `import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { router } from './routes/index.js'
import { config } from './config/index.js'
import { errorHandler } from './middleware/index.js'

const app = express()

app.use(helmet())
app.use(cors({ origin: config.corsOrigins }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/', router)

app.use((_req, res) => {
  res.status(404).json({ message: 'Not Found' })
})

app.use(errorHandler)

export { app }
`,
  'src/config/index.js': `import pino from 'pino'

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
  'src/middleware/index.js': `import { config } from '../config/index.js'

export function errorHandler(err, req, res, _next) {
  config.logger.error(err, 'Unhandled error')
  res.status(err.status || 500).json({
    message: config.isProduction ? 'Internal Server Error' : err.message,
    ...(config.isProduction ? {} : { stack: err.stack }),
  })
}
`,
  'src/routes/index.js': `import { Router } from 'express'
import { getHello } from '../controllers/index.js'

const router = Router()

router.get('/', getHello)

export { router }
`,
  'src/controllers/index.js': `export function getHello(req, res) {
  res.json({ message: 'Hello from Expressit!' })
}
`,
}
