import type { Database, PackageManager } from '../types.js'

export const commonTemplate: Record<string, string> = {
  '.gitignore': `node_modules/
dist/
.env
.env.local
.env.*.local
*.log
.DS_Store
coverage/
*.tsbuildinfo
`,
  '.env': `PORT=3000
NODE_ENV=development
CORS_ORIGINS=*
LOG_LEVEL=info
`,
  '.env.example': `PORT=3000
NODE_ENV=development
CORS_ORIGINS=*
LOG_LEVEL=info
`,
  '.dockerignore': `node_modules/
.git/
.env
.env.*
*.log
dist/
coverage/
`,
  Dockerfile: `FROM node:22-alpine

WORKDIR /app

COPY package.json ./
RUN __PM_INSTALL__

COPY . .

EXPOSE 3000

CMD ["__PM__", "start"]
`,
  'docker-compose.yml': `services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
    command: __PM_DEV__
`,
  'README.md': `# __PROJECT_NAME__

An Express.js project created with [Expressit](https://github.com/anomalyco/expressit).

## Getting Started

\`\`\`bash
__PM_DEV__
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

- \`__PM_DEV__\` — Start development server with hot reload
- \`__PM_START__\` — Start production server
- \`__PM_BUILD__\` — Build for production (TypeScript only)
- \`__PM_TYPECHECK__\` — Check types (TypeScript only)

## Project Structure

\`\`\`
src/
├── index.__EXT__      # Entry point
├── app.__EXT__        # Express app setup
├── config/            # Configuration
├── controllers/       # Route handlers
├── db/                # Database connection (optional)
├── middleware/        # Custom middleware
├── routes/            # Route definitions
└── types/             # TypeScript types (optional)
\`\`\`

## Environment Variables

Copy \`.env.example\` to \`.env\` and adjust as needed.

| Variable        | Default                                  | Description                |
|-----------------|------------------------------------------|----------------------------|
| \`PORT\`         | \`3000\`                                  | Port the server runs on    |
| \`NODE_ENV\`     | \`development\`                           | Environment mode           |
| \`CORS_ORIGINS\` | \`*\`                                     | Allowed CORS origins       |
| \`LOG_LEVEL\`    | \`info\`                                  | Pino log level             |
`,
}

export const pmCommands: Record<
  PackageManager,
  { install: string; start: string; dev: string; build: string; typecheck: string; run: string }
> = {
  npm: {
    install: 'npm install',
    start: 'npm start',
    dev: 'npm run dev',
    build: 'npm run build',
    typecheck: 'npm run typecheck',
    run: 'npm run',
  },
  yarn: {
    install: 'yarn',
    start: 'yarn start',
    dev: 'yarn dev',
    build: 'yarn build',
    typecheck: 'yarn typecheck',
    run: 'yarn',
  },
  pnpm: {
    install: 'pnpm install',
    start: 'pnpm start',
    dev: 'pnpm dev',
    build: 'pnpm build',
    typecheck: 'pnpm typecheck',
    run: 'pnpm',
  },
  bun: {
    install: 'bun install',
    start: 'bun start',
    dev: 'bun run dev',
    build: 'bun run build',
    typecheck: 'bun run typecheck',
    run: 'bun run',
  },
}

export function getDockerComposeServices(databases: Database[]): string {
  const active = databases.filter((d) => d !== 'none')
  if (active.length === 0) return ''

  const dbServices: Record<string, string> = {
    mongodb: `  mongodb:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
`,
    postgresql: `  postgresql:
    image: postgres:16
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: __PROJECT_NAME__
    volumes:
      - postgresql_data:/var/lib/postgresql/data
`,
    mysql: `  mysql:
    image: mysql:8
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: __PROJECT_NAME__
    volumes:
      - mysql_data:/var/lib/mysql
`,
    sqlite: '',
    mariadb: `  mariadb:
    image: mariadb:11
    ports:
      - "3306:3306"
    environment:
      MARIADB_ROOT_PASSWORD: root
      MARIADB_DATABASE: __PROJECT_NAME__
    volumes:
      - mariadb_data:/var/lib/mysql
`,
    sqlserver: `  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    ports:
      - "1433:1433"
    environment:
      ACCEPT_EULA: "Y"
      SA_PASSWORD: "YourPassword123!"
      MSSQL_DATABASE: __PROJECT_NAME__
    volumes:
      - sqlserver_data:/var/opt/mssql
`,
    redis: `  redis:
    image: redis:7
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
`,
  }

  let services = ''
  const volumeNames: string[] = []

  for (const db of active) {
    const svc = dbServices[db]
    if (svc) {
      services += svc
      const volName = `${db}_data`
      if (svc.includes(`volumes:\n      - ${volName}:`)) {
        volumeNames.push(volName)
      }
    }
  }

  if (!services) return ''

  let volumesSection = '\nvolumes:\n'
  for (const vol of [...new Set(volumeNames)]) {
    volumesSection += `  ${vol}:\n`
  }

  return services + volumesSection
}
