# GitHub Copilot Instructions

## Project Overview

This repository hosts a NestJS Backend API application for "Where-to-Go," a real-time event discovery platform designed to help users explore local events based on their interests and location.

## Key Features

- **Event Discovery:** Users can discover local events in real-time, categorized by interest.
- **Event Details:** Detailed event information including date, time, location, and descriptions.
- **User Interactions:** Bookmarking events, receiving updates, and managing preferences.
- **Authentication:** Secure OAuth integration for user sign-in and access control.

## Architecture
 
The application follows a modular **Clean Architecture** with clearly defined layers:

### Domain Layer (`src/domain/`)

- **Entities:** Core business objects (`user.entity.ts`, `organizer.entity.ts`).
- **DTOs:** Data transfer objects for API contracts.
- **Repositories:** Interfaces for data access (`user.repository.ts`, `auth.repository.ts`).
- **Services:** Business logic interfaces (`auth.service.ts`, `event.service.ts`).
- **Types:** Enumerations and type definitions (`user-role.enum.ts`).

### Application Layer (`src/application/`)

- **Use Cases:** Implementation of business logic:
  - `register-user.usecase.ts`
  - `login-user.usecase.ts`
  - `create-event.usecase.ts`
  - `bookmark-event.usecase.ts`

### Infrastructure Layer (`src/infrastructure/`)

- **Database:** Prisma ORM for database operations (`prisma.service.ts`, `prisma.schema.ts`).
- **External Services:** Integration with third-party services (`supabase.service.ts`, `google-maps.service.ts`).
- **Mappers:** Data transformation utilities (`entity.mapper.ts`, `dto.mapper.ts`).

### Presentation Layer (`src/modules/`)

- **Controllers:** Request handlers for HTTP endpoints (`auth.controller.ts`, `event.controller.ts`).
- **Modules:** NestJS module organization (`auth.module.ts`, `event.module.ts`).
- **Providers:** Dependency injection configuration (`user.providers.ts`, `auth.providers.ts`).

## Development Tools & Practices

### Technologies Used

- **NestJS:** Framework for building efficient and scalable server-side applications.
- **Prisma:** Database ORM for PostgreSQL integration.
- **Supabase:** Authentication and database hosting service.
- **TypeScript:** Typed superset of JavaScript for robust codebase.
- **Jest:** Unit testing framework for ensuring code quality and reliability.
- **Swagger:** API documentation tool for clear and accessible API specification.

### Development Workflow

- **Continuous Integration:** Automated testing and deployment using GitHub Actions (`.github/workflows`).
- **Version Control:** Git for version management and collaboration.
- **Code Quality:** ESLint and Prettier for code formatting and linting.
- **Environment Configuration:** `.env` files managed with `@nestjs/config` for environment-specific settings.

## Pull Request Instructions

When submitting a pull request:

1. **Create Unit Tests:** Include unit tests for new use cases added in the `src/application/use-cases/` directory.
2. **Extend E2E Tests:** Update and extend the existing end-to-end (e2e) tests in the `test/` directory to cover new use cases.
3. **Commit Tests:** Create commits with the necessary unit and e2e tests based on the changes made.


