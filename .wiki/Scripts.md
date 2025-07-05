# FleetFusion Package Scripts Documentation

This document provides comprehensive information about all available npm scripts in the FleetFusion project.

## Development Scripts

### `npm run dev`

Starts the Next.js development server with hot reloading enabled.

### `npm run predev`

Automatically runs before `npm run dev` to ensure Prisma client is generated.

### `npm run build`

Builds the application for production. Runs type checking and linting before building.

### `npm run start`

Starts the production server (requires `npm run build` first).

### `npm run preview`

Builds and immediately starts the production server in one command.

## Database Scripts

### `npm run db:generate`

Generates the Prisma client based on your schema.

### `npm run db:migrate`

Creates and applies new database migrations in development.

### `npm run db:migrate:deploy`

Applies migrations in production environments.

### `npm run db:push`

Pushes schema changes directly to the database (good for prototyping).

### `npm run db:seed`

Runs the database seeding script to populate with initial data.

### `npm run db:reset`

Resets the database and applies all migrations from scratch.

### `npm run db:studio`

Opens Prisma Studio for visual database management.

### `npm run db:format`

Formats the Prisma schema file.

### `npm run db:validate`

Validates the Prisma schema for errors.

### `npm run db:deploy`

Production deployment script that runs migrations and generates client.

## Testing Scripts

### `npm run test`

Runs unit tests in watch mode using Vitest.

### `npm run test:run`

Runs all unit tests once without watch mode.

### `npm run test:watch`

Runs unit tests in watch mode (explicit).

### `npm run test:coverage`

Runs tests and generates coverage report.

### `npm run test:e2e`

Runs end-to-end tests using Playwright.

### `npm run test:e2e:ui`

Runs Playwright tests with UI mode for debugging.

### `npm run test:e2e:debug`

Runs Playwright tests in debug mode.

### `npm run test:all`

Runs both unit tests and e2e tests.

## Code Quality Scripts

### `npm run type-check`

Runs TypeScript compiler to check for type errors without emitting files.

### `npm run type-check:watch`

Runs TypeScript type checking in watch mode.

### `npm run lint`

Runs ESLint to check for code quality issues.

### `npm run lint:fix`

Runs ESLint and automatically fixes fixable issues.

### `npm run format`

Formats all code using Prettier.

### `npm run format:check`

Checks if code is properly formatted without making changes.

## Cleanup Scripts

### `npm run clean:cache`

Removes Next.js cache and node_modules cache.

### `npm run clean:all`

Removes all build artifacts and node_modules, then reinstalls dependencies.

### `npm run clean:build`

Removes only the Next.js build directory.

### `npm run clean:deps`

Removes node_modules and package-lock.json, then reinstalls dependencies.

## Dependency Management Scripts

### `npm run deps:check`

Shows outdated dependencies.

### `npm run deps:update`

Updates all dependencies to their latest versions.

### `npm run deps:audit`

Runs security audit on dependencies.

### `npm run deps:audit:fix`

Automatically fixes security vulnerabilities in dependencies.

## Setup Scripts

### `npm run setup`

Quick setup for development: installs dependencies, generates Prisma client, and pushes schema.

### `npm run setup:full`

Full setup including database migrations and seeding.

## CI/CD Scripts

### `npm run verify`

Runs all checks: type-check, lint, and tests.

### `npm run ci`

Complete CI pipeline: install, verify, and build.

### `npm run prebuild`

Automatically runs before build to ensure code quality.

## Common Workflows

### Initial Setup

```bash
npm run setup:full
```

### Daily Development

```bash
npm run dev
```

### Before Committing

```bash
npm run verify
```

### Production Build

```bash
npm run build
npm run start
```

### Database Updates

```bash
npm run db:migrate
npm run db:seed
```

### Full Reset

```bash
npm run clean:all
npm run setup:full
```

## Script Dependencies

- **tsx**: Required for running TypeScript files directly (database seeding)
- **rimraf**: Cross-platform file deletion utility
- **prisma**: Database toolkit and CLI
- **vitest**: Testing framework
- **playwright**: End-to-end testing
- **eslint**: Code linting
- **prettier**: Code formatting
- **typescript**: TypeScript compiler

## Environment Requirements

- Node.js >= 18.0.0
- npm or yarn
- PostgreSQL database (via Neon)
- Environment variables configured (see .env.example)

## Troubleshooting

### Common Issues

1. **Database connection errors**: Check your DATABASE_URL and DIRECT_URL environment variables
2. **Type errors**: Run `npm run type-check` to identify issues
3. **Test failures**: Ensure database is seeded with test data
4. **Build failures**: Run `npm run verify` to check all prerequisites

### Reset Everything

If you encounter persistent issues:

```bash
npm run clean:all
npm run setup:full
```
