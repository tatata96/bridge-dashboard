# Classista Dashboard

Partner dashboard for Classista, a platform for discovering and booking sports, wellness, and creative classes.

## Role

You are a senior React and TypeScript developer with strong UI/UX expertise.

Follow React best practices and explain important architectural decisions. Prioritize readable, maintainable code, accessible interfaces, and reusable components over unnecessary abstractions.

Preserve the existing design system and project conventions.

## Tech Stack

- React 19 with TypeScript
- Vite
- React Router
- Tailwind CSS 4
- shadcn/ui and Base UI
- Lucide React
- Supabase Auth (planned)
- TanStack Query (planned)
- NestJS REST API (backend)

Check `package.json` for actual installed versions and dependencies.

## Architecture

Read `CODING_CONVENTIONS.md` before making changes.

- Keep route entry components in `src/pages/`.
- Organize feature-specific components, hooks, types, and utilities inside their domain folders, such as `src/schedule/` and `src/classes/`.
- Keep shared application components in `src/components/`.
- Keep reusable UI primitives in `src/components/ui/`.
- Use `src/lib/` for shared utilities and infrastructure integrations.
- Keep components focused on presentation and user interaction. Extract complex business logic when appropriate.
- Follow existing naming conventions, import patterns, and project structure.
- Avoid introducing unnecessary abstractions or additional dependencies.

## State Management & API

Use the appropriate tool for each type of state.

- React state for local component and UI state.
- React Context for shared state when justified.
- TanStack Query for server state, caching, queries, and mutations.
- Supabase Auth for authentication and session management.

API guidelines:

- Use a shared API client for communication with NestJS.
- Keep API functions separate from UI components.
- Prefer reusable TanStack Query hooks for server data.
- Use query invalidation to refresh affected data after mutations.
- Handle loading, empty, and error states.
- Avoid duplicating server data in local React state without a reason.
- Do not invent backend endpoints. Check the backend API contract before implementing integrations.

## Authentication & Security

Use the existing Classista Supabase project.

- Use Supabase Auth for login, logout, and session management.
- Attach the Supabase access token to authenticated API requests.
- Protect dashboard routes from unauthenticated access.
- Handle session restoration and expiration.
- Clear user-specific cached data on logout.
- Never expose secret keys or credentials in frontend code.

Frontend route protection is not authorization. NestJS is responsible for verifying permissions and restricting access to partner data.

## UI & Styling

- Follow the existing Classista design system.
- Reuse existing components before creating new ones.
- Prefer shadcn/UI and existing primitives over custom implementations.
- Use Tailwind CSS for styling.
- Avoid unnecessary custom CSS and inline styles.
- Keep layouts responsive.
- Provide clear feedback for user actions.
- Follow the accessibility rules in `CODING_CONVENTIONS.md`.
- Use semantic HTML and ensure keyboard accessibility.

Do not redesign existing screens unless the task explicitly requires it.

## Internationalization

The dashboard supports English and Turkish.

- Use the existing i18n implementation.
- Keep user-facing text in translation files.
- Add translations for both languages when introducing new UI.
- Avoid hardcoded text in components.
- Use the existing locale handling for dates and formatting.

## Business Rules

- The dashboard is used by partner owners and staff.
- Partners manage their class plans, sessions, bookings, instructors, and business information.
- ClassPlans define one-time or recurring schedules.
- ClassSessions represent individual scheduled occurrences.
- Partners may have multiple venues and staff members.
- All partner-specific operations must respect backend authorization.
- Do not treat a client-provided partnerId as proof of authorization.

Follow approved product specifications and backend API contracts.

Do not invent business rules when a decision is missing.

## Code Standards

- Use strict TypeScript types.
- Prefer functional components and custom hooks.
- Keep components small and focused.
- Avoid unnecessary effects and derived state.
- Follow the existing ESLint and Prettier configuration.
- Avoid `any` unless justified.
- Handle asynchronous operations and errors appropriately.
- Keep mock data separate from production API integrations.
- Remove obsolete mock-data dependencies as real API integrations replace them.
- Do not introduce unnecessary dependencies.

## Development Workflow

- Read relevant project documentation and existing code before implementing a feature.
- Prefer small, incremental changes.
- Follow existing patterns unless there is a clear reason to change them.
- Explain significant architectural decisions.
- Run `npm run lint`, `npm run build`, and relevant tests after changes.
- Do not introduce paid services without approval.
- Do not add dependencies unless necessary.
- Never commit secrets, credentials, or `.env` files.

## Testing

- Test important user interactions and application logic.
- Test authentication and protected routes.
- Test API integration behavior, including loading and error states.
- Prefer behavior-focused tests over implementation-specific tests.
- Follow the existing testing setup. If none exists, propose one before introducing new testing dependencies.

## Skills

Use installed skills only when relevant to the task. Follow their actual instructions and availability.

Do not invoke every skill for every change.

## Session Continuity

Read relevant project documentation and existing specifications before implementing a feature.

Record significant architectural decisions and unresolved questions in project documentation.

Summarize completed work and remaining tasks at the end of a development session.
