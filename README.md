# Upahku - Employment Trust Platform

Platform for Indonesian informal workers to build verifiable professional reputation.

## Tech

| Layer | Stack |
|-------|-------|
| Framework | Next.js 16 (App Router) |
| UI | shadcn/ui + Tailwind CSS v4 |
| Auth | Supabase Auth (email, Google OAuth) |
| Database | Supabase (Postgres) |
| Validation | Zod |
| Testing | Jest + TypeScript |

## Auth

| Method | Register | Login |
|--------|----------|-------|
| Email | email + password | email + password |
| Google | OAuth - auto-creates account | OAuth - same flow |

After registration, users complete their profile at `/profile/setup` and are redirected to their role-based dashboard.

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

### Configure Supabase Dashboard

1. **Google OAuth** - Authentication → Providers → Google: enable, add Client ID + Secret
2. **Redirect URLs** - add `http://localhost:3000/auth/callback` to Auth → URL Configuration
3. **SQL Migrations** - apply with `npx supabase link --project-ref <ref>` then `npx supabase db push`

## Project Structure

```text
app/
  (auth)/                  - login, register pages
  api/
    agreement/             - agreement CRUD + state transition
    employer/              - employer CRUD
    listings/              - public worker browse endpoint
    proof-of-work/         - proof of work CRUD
    trust-score/[workerId] - trust score read
    verification/          - community verification CRUD
    wage-estimate/         - wage estimate lookup
    worker/                - worker CRUD
  browse/                  - explore workers page
  worker/, employer/, admin/ - role-gated dashboards
  profile/                 - public profiles, setup
lib/
  auth/require-role.ts     - role + session guard for API routes
  errors.ts                - UnauthorizedError, ForbiddenError
  repositories/            - data access layer (5 entities)
  services/
    agreement-flow.ts      - state machine (draft→active→completed/disputed)
    trust-engine.ts        - trust score computation
    listings.ts            - public listing queries
  supabase/                - client, server, admin, proxy helpers
  validators/              - Zod schemas (5 entities)
proxy.ts                   - Next.js 16 proxy: API auth + page route guard
supabase/migrations/       - up SQL migrations (push with `npx supabase db push`)
supabase/down-migrations/   - reversible down SQL (kept out of migrations/ for CLI)
tests/                     - Jest tests (validators, trust-engine, integration)
```

## Agreement State Machine

```text
draft -> active -> completed
              |
              +-> disputed -> completed
```

- **PATCH `/api/agreement/[id]`** - updates non-status fields only (rejects `status`)
- **POST `/api/agreement/[id]/transition`** - sole entry point for status changes. Body: `{ "newStatus": "active" | "completed" | "disputed" }`. Returns 400 on invalid transition, 403 if actor is not a party.
- Trust score recomputed on `completed` and `disputed` transitions.

## Reviews

- **POST `/api/review`** - submit or update the review for a completed agreement. Body: `{ "agreementId", "rating" (0-5), "comment"?, "photoUrls"? (max 3) }`. Only the employer party can review, and only after the agreement is `completed`. One review per agreement (a second submit overwrites).
- **POST `/api/review/[id]/photo`** - multipart upload of a review photo to the `review-photos` bucket.
- **GET `/api/review?workerId=`** - lists a worker's reviews with the employer name.
- Submitting a review marks the agreement's proof of work as `customer_confirmed` and feeds the worker's Trust Score.

## API Routes

| Method | Route | Auth |
|--------|-------|------|
| GET | `/api/listings?category=&city=&search=&sort=&limit=&offset=` | Public |
| GET | `/api/wage-estimate` | Public |
| GET | `/api/worker/[id]`, `/api/employer/[id]` | Public |
| GET | `/api/proof-of-work/[id]`, `/api/trust-score/[workerId]` | Public |
| POST/PATCH/DELETE | All other `/api/*` | Session required |
| GET | `/api/agreement/[id]`, `/api/verification/[id]` | Session + party/owner check |

## Verification

```bash
npm test                 # run all tests
npx tsc --noEmit         # type check
npm run build            # production build
```
