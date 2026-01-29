# Logbie UI

A [Next.js](https://nextjs.org) application with a unified UI framework that provides organized access to framework actions through namespaces. It serves as a single entry point for database operations, authentication, testing, Next.js utilities, runtime detection, and custom commands.

## Features

The UI framework is organized into six main namespaces:

| Namespace | Purpose |
|-----------|---------|
| **`ui.db`** | Database operations and schemas (Drizzle ORM) |
| **`ui.auth`** | Authentication, server and client (better-auth) |
| **`ui.test`** | Testing utilities and helpers (Mocha) |
| **`ui.next`** | Next.js framework integration |
| **`ui.bun`** | Bun runtime detection and utilities |
| **`ui.commands`** | Custom command system (plugin and registry) |

Key benefits: unified API, full TypeScript support, logical namespace organization, and seamless integration with Next.js, Drizzle, and better-auth.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) or [Bun](https://bun.sh/)
- A package manager: npm, yarn, pnpm, or bun

### Installation

```bash
# Install dependencies
npm install
# or
bun install
```

### Environment Variables

Create a `.env` file in the project root. Required and optional variables:

```env
# Database (required for db operations)
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Auth (required for authentication)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
# or
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
```

### Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

For detailed framework usage, see [UI Framework Documentation](docs/UI_FRAMEWORK.md).

## Project Structure

| Directory | Description |
|-----------|-------------|
| `src/app/` | Next.js App Router pages, layouts, and API routes |
| `src/ui/` | UI framework namespace implementations |
| `src/db/` | Database schemas and Drizzle configuration |
| `src/lib/` | Library utilities (auth client/server setup) |
| `test/` | Test files and helpers |
| `docs/` | Documentation |

## Available Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start the development server |
| `build` | Create a production build |
| `start` | Start the production server |
| `lint` | Run ESLint |
| `db:generate` | Generate Drizzle migrations |
| `db:migrate` | Run database migrations |
| `db:push` | Push schema to the database |
| `db:studio` | Open Drizzle Studio |
| `auth:generate` | Generate better-auth types |
| `auth:db-push` | Push auth schema to the database |
| `test` | Run tests |
| `test:watch` | Run tests in watch mode |
| `test:coverage` | Generate test coverage (JSON reporter) |

## Technology Stack

- **Next.js** 16+ (App Router)
- **React** 19
- **TypeScript**
- **Drizzle ORM** with PostgreSQL
- **better-auth** for authentication
- **Mocha** for testing
- **Tailwind CSS** 4
- **Bun** runtime support

## Quick Start Example

```typescript
import { ui } from "@/ui";

// Server component: get current user and data
export default async function Page() {
  const user = await ui.auth.getCurrentUser();
  const runtime = ui.bun.getRuntime();

  return (
    <div>
      <p>Welcome, {user?.name ?? "Guest"}!</p>
      <p>Runtime: {runtime}</p>
    </div>
  );
}
```

More examples and patterns are in [docs/UI_FRAMEWORK.md](docs/UI_FRAMEWORK.md).

## Development Workflow

1. **Database**: Set `DATABASE_URL`, then run `db:push` or `db:migrate` to apply schema.
2. **Auth**: Set `NEXT_PUBLIC_APP_URL` (or `NEXT_PUBLIC_BETTER_AUTH_URL`). Use `auth:db-push` to sync auth tables.
3. **Testing**: Run `npm run test` or `bun test`. Use `ui.test` in tests for describe/it/assert.
4. **Linting**: Run `npm run lint` (or equivalent) before committing.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | For db features | PostgreSQL connection string |
| `NEXT_PUBLIC_APP_URL` | For auth | App URL (e.g. `http://localhost:3000`) |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | For auth | Alternative to `NEXT_PUBLIC_APP_URL` for better-auth |

## Documentation

- **[UI Framework Documentation](docs/UI_FRAMEWORK.md)** – Namespace reference, examples, and API details
- **Source**: `src/ui/` for framework implementation
- **Tests**: `test/` for usage examples (e.g. `test/ui-framework.test.ts`)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview)
- [better-auth](https://www.better-auth.com/docs)
