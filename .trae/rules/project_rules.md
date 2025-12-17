# Project Rules

## Overview
- Tech stack: `React` + `TypeScript`, `TanStack Query`, `Axios`, `Zod`, `React Hook Form`, `Zustand`, `TailwindCSS`.
- Path alias: use `@src/*` for imports as configured in `tsconfig.app.json:25-29`.
- Environment: `VITE_API_URL` in `env.example:1` controls API base URL.

## Directory Structure
- `src/app`: application shell, providers, router, and entry points.
- `src/layouts`: layout components used by routes.
- `src/pages`: route-level components that render feature `ui` pages.
- `src/features/<feature>`: feature-sliced modules.
- `src/shared`: cross-feature utilities, components, hooks, constants, and API setup.
- `src/assets`: images and static assets grouped by domain.

## Feature Slice Conventions
- Each feature keeps scoped subfolders:
  - `components`: reusable view components for the feature.
  - `lib`: API calls and local utilities (`*.api.ts`).
  - `model`: data layer hooks for queries/mutations (`*.query.ts`, `*.mutation.ts`).
  - `schema`: Zod schemas and TypeScript types (`*.schema.ts`, `*.types.ts`).
  - `ui`: parent UI pages that the route renders.
- Prefer barrel files (`index.ts`) to re-export public APIs inside `components/lib/model` where helpful.
- File naming:
  - Components: `PascalCase.tsx` (e.g., `LoginInterface.tsx`).
  - API modules: `kebab-case.api.ts` (e.g., `event.api.ts`).
  - Queries/Mutations: `kebab-case.query.ts` / `kebab-case.mutation.ts`.
  - Schemas/Types: `kebab-case.schema.ts` / `kebab-case.types.ts`.

## Schemas and Types (Zod)
- Define validation schemas in `schema` using `zod` and export inferred types via `z.infer`.
- Example: `src/features/main/organization/profile/schema/event.schema.ts:49-76` defines `createEventSchema`, `editEventSchema`, and inferred types.
- Keep UI-facing types in `*.types.ts` and form validation in `*.schema.ts`.

## Forms (React Hook Form + Zod)
- Initialize forms with `useForm` and `zodResolver(schema)`; set `defaultValues` explicitly.
- Read-only example: `src/features/auth/ui/LoginInterface.tsx:24-30` initializes the form with resolver and defaults.
- Display errors from `formState.errors` and use `register` for fields.
- For file inputs, use `setValue` to update file fields and create previews when needed (see `src/features/auth/ui/SignUpMemberInterface.tsx:44-55`).

## API Layer (Axios)
- Use the shared axios instance in `src/shared/api/axios.ts:4-12,14-30`.
- Base URL comes from `VITE_API_URL`; `withCredentials` enabled.
- 401 responses trigger a redirect to `/login` except for signin requests.
- Use `objectToFormData` for requests requiring `FormData` and file uploads: `src/shared/utils/formDataConverter.ts:5-45`.
- Keep feature API calls in `lib/*.api.ts` with clear input/output types.

## Data Fetching (TanStack Query)
- Initialize `QueryClient` in providers: `src/app/Provider.tsx:7-15`.
- Use `QUERY_KEYS` constants for consistent query keys: `src/shared/constants/queryKeys.ts:5-40`.
- Queries live in `model/*.query.ts` (e.g., `useInfiniteQuery` in `src/features/comments/model/comment.infinite.query.ts:1-12`).
- Mutations live in `model/*.mutation.ts` and should:
  - Call feature `lib/*.api.ts` functions.
  - Invalidate relevant queries on success using `queryClient.invalidateQueries` with specific `QUERY_KEYS`.
  - Provide user feedback via toast helpers on success/error.
- Example mutation invalidations and toasts: `src/features/home/model/home.mutation.ts:16-46`.

## UI Pages and Components
- Route-level pages under `src/pages` should render feature `ui` components only.
- Example: `src/pages/auth/Login.tsx:1-5` renders `LoginInterface` from `features/auth/ui`.
- Shared UI building blocks live under `src/shared/components` (e.g., buttons, modals, toasts).
- Use modal components and confirmation hooks from `shared` for consistent UX.

## Routing and Access Control
- Centralized router in `src/app/routes/router.tsx:34-130` with public, auth, and protected sections.
- Wrap protected routes with `ProtectedRoute` and provide `allowedRoles` when needed.
- Use layouts to group related routes (`LandingLayout`, `AuthLayout`, `MainLayout`).

## State Management
- Use `Zustand` for auth state persistence: `src/shared/store/auth.ts:9-55`.
- Access the store via `useAuthStore` and avoid prop-drilling for auth context.
- Use `features/auth/lib/auth.hydration.ts` hooks for session hydration and periodic validation.

## Assets and Paths
- Group images by domain under `src/assets/<domain>` and reference via the `@src` alias.
- Prefer helper hooks (e.g., `useImageUrl`) to construct image URLs consistently.

## Environment and Build
- Configure envs in `.env` from `env.example:1`.
- Commands:
  - Dev: `npm run dev`
  - Lint: `npm run lint`
  - Build: `npm run build`
  - Preview: `npm run preview`

## Error and Toast Handling
- Use toast helpers `showSuccessToast` and `showErrorToast` for user feedback: `src/shared/components/Toast/CustomToast.tsx:21-63`.
- Prefer handling errors inside mutations’ `onError` and keep UI-specific messages localized to the calling component.

## Naming and Code Style
- Components and hooks: `PascalCase` filenames for `*.tsx`.
- Functions, variables: `camelCase`.
- Keep exports minimal and explicit; use barrels selectively.
- Use the `@src` alias for intra-project imports; avoid deep relative paths.

## Example Flow: Event Creation
- Schema: define in `schema` (`event.schema.ts:49-76`).
- Form UI: implement with RHF + Zod, manage image via `setValue` (see `EventFormModal.tsx`).
- API: post via `createEvent` using `objectToFormData` (`event.api.ts:55-72`).
- Mutation: `useCreateEvent` invalidates relevant queries and raises toasts (`event.mutation.ts:1-19`).
- Close modal and reset form on success; keep edits from clearing images by omitting unchanged file fields (see `EventFormModal.tsx` behavior around submission).