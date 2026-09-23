# Dashboard Authentication & API Setup — Design

Branch: `feat/dashboard-authentication`
Date: 2026-09-23

## Goal

Connect the partner dashboard to Supabase Auth and the NestJS backend, and set
up TanStack Query for fetching and updating server data.

## Scope

- Partner login with email/password, logout, session persistence across
  refreshes.
- An auth context/hook exposing current user, session, and loading state.
- Protected dashboard routes that redirect unauthenticated users to `/login`.
- Handling of login failures and expired sessions.
- A shared API client for the NestJS backend that attaches the current
  Supabase access token as a Bearer token, with consistent error handling.
- TanStack Query wired up (`QueryClient` + `QueryClientProvider`) as the
  foundation for future data-fetching hooks. No entity-specific query hooks
  are added in this change — no backend endpoints have been specified yet.
- Access tokens are never stored separately from Supabase's own session
  management; every reader gets the token via `supabase.auth.getSession()`.

## Approach

**State management:** React Context (`AuthContext` + `useAuth()`), mirroring
the existing `I18nProvider`/`useI18n()` pattern in `src/i18n/i18n.tsx` —
same file shape, same "throw if used outside provider" guard. Rejected: a
global store (Zustand/Redux) — nothing else in the app uses one, and this is
a single piece of shared, provider-scoped state.

**API client:** a small `fetch` wrapper, not axios — no HTTP library is
currently a dependency, and a thin wrapper is enough to attach the bearer
token and normalize errors. TanStack Query hooks call into it.

**Route protection:** a `<ProtectedRoute>` layout route wrapping the
existing sidebar layout in `App.tsx`, redirecting to `/login` when there's
no session.

## File layout

Following `CODING_CONVENTIONS.md` (domain folder for domain-specific code,
`src/lib` for shared utilities, `src/pages` for route entries only). `auth`
ended up as a top-level domain folder (like `src/schedule`, `src/classes`)
rather than nested under `lib`, since it's a full domain — client, context,
and route guard — not just a utility; `src/lib/network` holds the generic,
domain-agnostic server-communication pieces:

```
.env                                 new, gitignored — real Supabase + backend values, not committed
src/vite-env.d.ts                    new — typed ImportMetaEnv for the three VITE_ vars
src/auth/supabase-client.ts          new — the supabase-js client singleton
src/auth/AuthContext.tsx             new — AuthProvider + useAuth()
src/auth/ProtectedRoute.tsx          new — redirect-if-unauthenticated layout route
src/lib/network/api-client.ts        new — apiFetch<T>() fetch wrapper + ApiError
src/lib/network/query-client.ts      new — QueryClient instance
src/pages/login/Login.tsx            new — route entry, exports LoginPage
src/pages/login/LoginForm.tsx        new — email/password form
src/main.tsx                         edit — wrap with AuthProvider + QueryClientProvider
src/App.tsx                          edit — public /login route; existing routes nest under ProtectedRoute
src/i18n/en.ts, tr.ts                edit — auth.* translation keys (login form/errors)
package.json                         edit — add @supabase/supabase-js, @tanstack/react-query
```

No `.env.example` template — real values live only in the gitignored
`.env`; other developers get their own values directly rather than from a
placeholder file.

## Auth flow

`AuthProvider` calls `supabase.auth.getSession()` on mount (`loading: true`
until it resolves) and subscribes to `supabase.auth.onAuthStateChange` to
stay current across login, logout, and token refresh. It exposes:

```ts
{
  (user, session, loading, signIn(email, password), signOut());
}
```

`signIn` returns `{ error }` instead of throwing, so `LoginForm` can show a
message inline rather than needing a try/catch.

`ProtectedRoute` renders a minimal loading state while `loading` is true,
`<Navigate to="/login" replace state={{ from: location }} />` when there's
no session, and `<Outlet />` otherwise. `Login.tsx` redirects to
`location.state.from` (or the default page) on successful sign-in.

Expired/invalid sessions: `onAuthStateChange` keeps the context in sync when
Supabase's client-side refresh fails and the session is cleared, and
`ProtectedRoute` reacts to that by redirecting to `/login` on the next
render — no separate polling or expiry timer needed.

## API client & TanStack Query

`apiFetch<T>(path, options)`: prefixes `VITE_API_BASE_URL`, reads the
current access token via `supabase.auth.getSession()` and attaches
`Authorization: Bearer <token>` when present, and throws a typed
`ApiError { status, message, details }` on non-2xx responses so every
caller/`onError` handler gets the same shape.

This change only wires up the `QueryClient` + `QueryClientProvider` and the
shared client — no entity-specific query hooks yet. Future feature work
builds `useQuery`/`useMutation` hooks on top of `apiFetch`.

## Testing

No test framework exists in this repo yet (no vitest/jest), so verification
is manual: run the dev server, confirm login/logout, session persistence
across a page refresh, and that visiting a protected route while logged out
redirects to `/login`.

## Open items for the user

Done — real Supabase project URL/anon key and the NestJS backend URL are
in the local, gitignored `.env`.
