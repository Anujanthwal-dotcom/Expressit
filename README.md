# create-expressit

Scaffold a modern Express.js project with zero config.

```bash
npx create-expressit
```

## Features

- **Interactive prompts** — Project name, language, databases, package manager
- **TypeScript & JavaScript** — Choose your language (TypeScript recommended)
- **8 database options** — MongoDB, PostgreSQL, MySQL, SQLite, MariaDB, SQL Server, Redis — including multi-database support
- **Built-in middleware** — CORS, Helmet, Pino logger, health check, error handler, 404 handler
- **Docker support** — Dockerfile + docker-compose.yml with optional database service definitions
- **Modern tooling** — ES modules, strict TypeScript, tsx for dev server
- **Package manager agnostic** — Works with npm, yarn, pnpm, or bun

## Usage

```bash
npx create-expressit my-app
cd my-app
npm run dev
```

Or run interactively:

```bash
npx create-expressit
```

## Development

```bash
# Install dependencies
bun install

# Run the CLI
bun run dev

# Compile to binary
bun run build

# Type check
bun run typecheck

# Test
bun run test

# Lint
bun run lint
```

## Project Structure

```
src/
├── index.ts            # CLI entry point
├── prompts.ts          # Interactive prompts
├── scaffold.ts         # Project generation logic
├── constants.ts        # Shared constants
├── types.ts            # Shared types
├── templates/          # Scaffolded file templates
│   ├── common.ts       # Shared files (env, docker, readme)
│   ├── javascript.ts   # JavaScript template files
│   ├── typescript.ts   # TypeScript template files
│   └── database.ts     # Database connection templates
├── utils/              # Utility functions
└── __tests__/          # Vitest tests
```

## License

MIT
