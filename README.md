# expressit

Scaffold a modern Express.js project with zero config.

## Features

- **Interactive prompts** — Project name, language, databases, package manager
- **TypeScript & JavaScript** — Choose your language (TypeScript recommended)
- **8 database options** — MongoDB, PostgreSQL, MySQL, SQLite, MariaDB, SQL Server, Redis — including multi-database support
- **Built-in middleware** — CORS, Helmet, Pino logger, health check, error handler, 404 handler
- **Docker support** — Dockerfile + docker-compose.yml with optional database service definitions
- **Modern tooling** — ES modules, strict TypeScript, tsx for dev server
- **Package manager agnostic** — Works with npm, yarn, pnpm, or bun

## Installation

### Run without installation (recommended)

```bash
npx @anujthecreator/expressit
```

### Install globally via npm

```bash
npm install -g @anujthecreator/expressit
```

Or with other package managers:

```bash
yarn global add @anujthecreator/expressit
pnpm add -g @anujthecreator/expressit
bun add -g @anujthecreator/expressit
```

Once installed, use the `expressit` command directly:

```bash
expressit
```

### Prebuilt binary

Prebuilt binaries are available for Linux (x64, arm64), macOS (x64, arm64), and Windows (x64). They are pulled automatically when you install the package — no additional setup required.

## Usage

### Interactive mode (recommended for first use)

```bash
npx @anujthecreator/expressit
```

Prompts you for project name, language, databases, package manager, and dependency installation.

### With a project name

```bash
npx @anujthecreator/expressit my-app
```

Skips the project name prompt and immediately asks for language, database, and other options.

### In the current directory

```bash
npx @anujthecreator/expressit .
```

Scaffolds the project in the current directory instead of creating a new folder.

### Using the global command

```bash
expressit
expressit my-app
expressit .
```

### View help

```bash
npx @anujthecreator/expressit --help
```

### Next steps

```bash
cd my-app
npm run dev
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
