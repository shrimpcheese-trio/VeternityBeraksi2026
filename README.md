# Upahku - Employment Trust Platform

Platform for Indonesian informal workers (tukang, teknisi AC, montir, fotografer, guru les, etc.) to build a verifiable professional reputation and get fair wages.

Existing platforms optimize how customers find workers. Upahku optimizes how workers build career and income over time: finished jobs become verifiable proof, proof becomes trust, and trust becomes fairer pay and bigger orders.

## Tech Stack

| Layer | Stack |
|-------|-------|
| Framework | Next.js (App Router) |
| UI | shadcn/ui + Tailwind CSS v4 |
| Auth | Supabase Auth (email, Google OAuth) |
| Database | Supabase (Postgres, Storage) |
| Validation | Zod |
| i18n | next-intl (id / en) |
| Testing | Jest + Playwright |

## Features

- **Role-based dashboards** - worker, employer, and admin surfaces with sidebar + top navigation.
- **Browse workers** - public listing of workers with keyword search, category tabs, city filters, experience/project/price ranges, and sorting (experience, trust score, projects).
- **Worker services** - workers publish a portfolio of services with images on their public profile.
- **Agreements + negotiation** - employers draft job offers; both parties counter-offer on price with a reason until the worker accepts.
- **Proof of work** - before/after photos uploaded per agreement; completing an agreement requires them.
- **Reviews** - employers rate completed agreements (0-5, optional comment and photos), which also confirms the proof of work.
- **Trust Score** - recomputed server-side only from verifications, reviews, proofs, completion rate, and tenure. No single input can dominate.
- **Community verification** - endorsements from mandor/RT/ketua banjar etc.
- **Settings** - account, company docs (SIUP/NPWP), verification status, payout methods, notifications, security sessions, danger zone.
- **Calendars** - monthly view of active agreements for both roles.

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

### Environment Variables

| Key | Description |
|-----|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key (client-safe) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |
| `NEXT_PUBLIC_APP_URL` | Public app base URL (e.g. `http://localhost:3000`) |

### Configure Supabase Dashboard

1. **Google OAuth** - Authentication → Providers → Google: enable, add Client ID + Secret
2. **Redirect URLs** - add `http://localhost:3000/auth/callback` to Auth → URL Configuration
3. **SQL Migrations** - apply with `npx supabase link --project-ref <ref>` then `npx supabase db push`

## Auth

| Method | Register | Login |
|--------|----------|-------|
| Email | email + password | email + password |
| Google | OAuth - auto-creates account | OAuth - same flow |

After registration, users complete their profile at `/profile/setup` and are redirected to their role-based dashboard. The role is stored in the auth user's `user_metadata.role` and only assigned after profile setup.

## Project Structure

```text
app/
  (auth)/                   - login, register, forgot-password pages
  auth/                     - OAuth callback + email confirmation routes
  api/
    agreement/              - agreement CRUD, transition, counter, proof upload
    avatar/                 - avatar upload + delete
    employer/               - employer CRUD
    listings/               - public worker browse endpoint
    proof-of-work/          - proof of work CRUD
    review/                 - review submit + photo upload
    trust-score/[workerId]  - trust score read
    upload/                 - proof-of-work photo upload (before/after)
    verification/           - community verification CRUD
    worker/                 - worker CRUD
    worker-services/        - worker services CRUD + images
  browse/                   - explore workers page + worker detail
  worker/, employer/        - role-gated dashboards (dashboard, agreements, calendar, services)
  workers/                  - admin worker list + edit pages
  profile/                  - profile setup, own profile, public profile/[id]
  settings/                 - account settings
components/
  admin/, agreements/, browse/, calendar/, calendar-employer/
  dashboard/                - sidebar, top-header, kpi, chart, reminder
  profile/, reviews/, sections/, settings/, shared/, ui/
lib/
  actions/                  - server actions (auth, settings, admin)
  repositories/             - data access layer (8 entities)
  services/
    agreement-flow.ts       - state machine + transitions
    trust-engine.ts         - trust score computation
    listings.ts             - public listing queries
    negotiation.ts          - counter-offer logic
    review.ts               - review submit + photo upload
    proof-of-work.ts        - proof validation
    profile.ts              - profile read models
  supabase/                 - server, browser, admin clients
  validators/               - Zod schemas (8 entities)
  i18n.ts, i18n-server.ts   - locale + server translator helpers
proxy.ts                    - Next.js proxy: API auth guard + page route guard
messages/                   - next-intl translation files (id.json, en.json)
supabase/migrations/        - up SQL migrations (push with `npx supabase db push`)
supabase/down-migrations/   - reversible down SQL (kept out of migrations/ for CLI)
tests/                      - Jest tests (unit + integration + mocks)
```

## Agreement State Machine

```text
draft -> active -> completed
               |
               +-> disputed -> completed
```

- **PATCH `/api/agreement/[id]`** - updates non-status fields only (rejects `status`).
- **POST `/api/agreement/[id]/transition`** - sole entry point for status changes. Body: `{ "newStatus": "active" | "completed" | "disputed" }`. Returns 400 on invalid transition, 403 if the actor is not a party.
- Transitioning to `completed` requires a proof of work with both before and after photos (otherwise `PROOF_OF_WORK_REQUIRED`).
- Trust Score is recomputed on `completed` and `disputed` transitions.

## Price Negotiation

- **POST `/api/agreement/[id]/counter`** - submit a counter-offer while the agreement is `draft`.
  - Worker counters require a `reason` and become a pending offer.
  - Employer counters respond to a pending worker offer and update the agreement price.
- Accepting a draft (`draft` → `active`) adopts the latest counter price when a worker counter is pending. A worker cannot accept while their own counter is pending.

## Reviews

- **POST `/api/review`** - submit or update the review for a completed agreement. Body: `{ "agreementId", "rating" (0-5), "comment"?, "photoUrls"? }`. Only the employer party can review, and only after the agreement is `completed`. One review per agreement (a second submit overwrites).
- **POST `/api/review/[id]/photo`** - multipart upload of a review photo (PNG/JPEG/WebP, max 5 MB) to the `review-photos` bucket.
- **GET `/api/review?workerId=`** - lists a worker's reviews with the employer name.
- Submitting a review marks the agreement's proof of work as `customer_confirmed` and feeds the worker's Trust Score.

## Trust Score

Computed exclusively server-side in `lib/services/trust-engine.ts` using the service-role client, then mirrored onto `worker_profiles.trust_score` so listings and profiles stay in sync. Weights total 100 and no single input can dominate:

| Input | Formula | Max |
|-------|---------|-----|
| Community verification rating | `avgRating × 4` | 20 |
| Review rating | `avgReviewRating × 5` | 25 |
| Verified proof of work | `count × 5` | 25 |
| Completion rate | `rate × 25` | 25 |
| Tenure | `monthsSinceJoin × 0.5` | 5 |

A failed read never zeroes out a previously computed score.

## API Routes

| Method | Route | Auth |
|--------|-------|------|
| GET | `/api/listings?category=&city=&search=&sort=&limit=&offset=` | Public |
| GET | `/api/worker/[id]`, `/api/employer/[id]` | Public |
| GET | `/api/trust-score/[workerId]` | Public |
| POST/PATCH/DELETE | All other `/api/*` | Session required |
| GET | `/api/agreement/[id]`, `/api/verification/[id]` | Session + party/owner check |
| POST | `/api/agreement/[id]/transition`, `/api/agreement/[id]/counter` | Session + party check |

## i18n

- Powered by `next-intl`; translation files live in `messages/id.json` and `messages/en.json`.
- Primary language is Bahasa Indonesia; locale is stored in a cookie and defaults to `id`.
- All user-facing strings go through translation keys in the active locale.

## Verification

```bash
npm run lint          # eslint
npx tsc --noEmit      # type check
npm test              # Jest unit + integration tests
npm run build         # production build
npm run test:e2e      # Playwright end-to-end tests
```
