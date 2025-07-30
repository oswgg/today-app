# Backend API

A NestJS application with Prisma ORM and Supabase integration.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
SUPABASE_AUTH_URL=https://svuzqlqdmkzrfvfedlxu.supabase.co
SUPABASE_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2dXpxbHFkbWt6cmZ2ZmVkbHh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1OTM5OTUsImV4cCI6MjA2OTE2OTk5NX0.xXhXX6YO-RyzBWysaRtsLg1yvTQNlbrfopGBtf6PLb4
```

## Installation

```bash
npm install
```

## Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

## Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```

## CI/CD

This project includes comprehensive GitHub Actions workflows:

### CI Workflow (`.github/workflows/ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Jobs:**

1. **Test Job:**
   - Sets up PostgreSQL service container
   - Installs dependencies
   - Generates Prisma client
   - Runs database migrations
   - Executes linting, unit tests, and e2e tests
   - Builds the application

2. **Security Job:**
   - Runs npm audit
   - Performs Snyk security scan (requires `SNYK_TOKEN` secret)

3. **Code Quality Job:**
   - Checks Prettier formatting
   - Runs ESLint
   - Validates TypeScript compilation

4. **Dependency Review Job:**
   - Reviews dependency changes in pull requests

### Deployment Workflow (`.github/workflows/deploy.yml`)

**Triggers:**
- Push to `main` branch

**Features:**
- Builds the application
- Generates Prisma client
- Ready for deployment to various platforms

### Required Secrets

Add these secrets to your GitHub repository:

- `SUPABASE_AUTH_URL`: Your Supabase project URL
- `SUPABASE_API_KEY`: Your Supabase API key
- `DATABASE_URL`: Your production database URL
- `SNYK_TOKEN`: (Optional) Snyk API token for security scanning

## API Endpoints

### Auth Controller
- `GET /auth/google` - Redirects to Google OAuth
- `POST /auth/google/callback` - Handles OAuth callback with user registration

### User Controller
- `GET /user/:id` - Retrieves user by ID

### App Controller
- `GET /` - Health check endpoint

## Architecture

This project follows Clean Architecture principles with:

- **Domain Layer**: Entities, repositories interfaces, and domain services
- **Application Layer**: Use cases and application services
- **Infrastructure Layer**: Database implementations, external services
- **Presentation Layer**: Controllers and DTOs

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Supabase Auth
- **Testing**: Jest with supertest for e2e tests
- **Code Quality**: ESLint, Prettier, TypeScript
