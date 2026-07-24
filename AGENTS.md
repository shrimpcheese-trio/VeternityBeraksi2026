# Employment Trust Platform — Agent Instructions

## Project Overview

**Employment Trust Platform** helps Indonesian informal workers (tukang, teknisi AC, montir, fotografer, guru les, etc.) build a verifiable professional reputation and get fair wages, instead of relying on Facebook Groups, WhatsApp Groups, word-of-mouth, or Sejasa.

Existing platforms optimize for how customers find workers. This platform optimizes for how workers build career and income over time.

Core user value: turn finished jobs into verifiable proof, turn proof into trust, turn trust into fairer pay and bigger orders.

---

## Technology Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js (App Router) |
| UI | shadcn/ui + Tailwind CSS |
| Backend / DB | Supabase (Postgres, Auth, Storage) |
| Language | TypeScript |
| State Validation | Zod |
| Testing | Jest / Playwright |

---

## Repository Structure

```
app/                  — Next.js App Router (routes, pages, API routes)
  api/                — REST API routes, thin wrappers over lib/services
components/           — UI components (Atomic Design)
  ui/                 — Base shadcn/ui components
  shared/             — Project-specific shared components
lib/
  services/           — Business logic (trust score, wage estimator, proof-of-work validation)
  supabase/           — Supabase server + browser clients (only place clients are instantiated)
  utils.ts            — shadcn utility (cn function)
types/                — Shared TypeScript types/interfaces
public/               — Static assets
supabase/
  migrations/         — SQL migrations (always reversible)
docs/                 — All documentation
tests/                — Unit, integration, and Playwright tests
```

---

## Architecture Principles

1. **Strict Decoupling**: UI components never call `lib/services` directly. They go through API routes or a thin `client` fetch wrapper.
2. **Thin API**: routes in `app/api` hold minimal logic, delegating all rules to `lib/services`.
3. **Server-Side Trust**: Trust Score and Fair Wage numbers are never computed or trusted from the client. Always recompute server-side.
4. **Shared Source of Truth**: types live in `types/`, not duplicated per component.

---

## Development Environment

### Local Setup

```bash
npm install
cp .env.example .env
npm run dev
```

> Note: `supabase/` directory is for future Supabase CLI migrations. Install the CLI (`npx supabase`) when schema changes are needed.

### Environment Variables

| Key | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key (client-safe) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only, never expose to client) |

---

## Roles & Permissions

| Role | Description |
|---|---|
| `guest` | Landing page, public worker profiles (read-only) |
| `worker` | Full worker access — profile, proof of work, trust score, wage estimator |
| `employer` | Search/book workers, view verified history, negotiate |
| `admin` | Platform management, verification dispute resolution |

---

## Database Conventions

- Snake_case table and column names.
- All tables have descriptive primary keys (`worker_id`, `proof_id`, `verification_id`, etc.) via `gen_random_uuid()`.
- Foreign keys always explicit with `ON DELETE CASCADE` or `ON DELETE SET NULL`.
- JSONB for flexible fields (`verification_sources`, `job_metadata`).
- RLS (Row Level Security) is ON by default on every new table. No exceptions without an explicit ask-first conversation.
- Migrations must have both `up` and `down` — always reversible.

---

## Key Models (MVP scope)

```
Worker              — auth user with worker role; holds profile + trust_score
Employer            — auth user with employer role
CommunityVerification — endorsement from mandor/RT/ketua banjar/etc, linked to a Worker
ProofOfWork         — a completed job record: photos, date, job type, value, customer confirmation
TrustScore          — derived, recomputed server-side from ProofOfWork + CommunityVerification + reviews
WageEstimate        — city + job type + experience → suggested wage range
Agreement           — digital agreement for a job: price, location, hours, description
```

### Schema Reference

```sql
-- Use Supabase Auth's built-in users table.
-- Role stored in a profile table, not in auth.users directly.

CREATE TABLE worker_profiles (
  worker_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name VARCHAR(200) NOT NULL,
  city VARCHAR(100) NOT NULL,
  job_category VARCHAR(100) NOT NULL,
  years_experience INT DEFAULT 0,
  trust_score NUMERIC(5,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE community_verifications (
  verification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID REFERENCES worker_profiles(worker_id) ON DELETE CASCADE,
  verifier_name VARCHAR(200) NOT NULL,
  verifier_role VARCHAR(100) NOT NULL, -- mandor | ketua_rt | ketua_banjar | pemilik_toko | other
  statement TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE proof_of_work (
  proof_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID REFERENCES worker_profiles(worker_id) ON DELETE CASCADE,
  job_type VARCHAR(100) NOT NULL,
  job_value NUMERIC(12,2),
  photo_before_url TEXT,
  photo_after_url TEXT,
  location_lat NUMERIC(9,6),
  location_lng NUMERIC(9,6),
  customer_confirmed BOOLEAN DEFAULT FALSE,
  job_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wage_estimates (
  estimate_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city VARCHAR(100) NOT NULL,
  job_type VARCHAR(100) NOT NULL,
  experience_band VARCHAR(50) NOT NULL, -- 0-1y | 1-3y | 3-5y | 5y+
  min_wage NUMERIC(12,2) NOT NULL,
  max_wage NUMERIC(12,2) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE agreements (
  agreement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID REFERENCES worker_profiles(worker_id) ON DELETE CASCADE,
  employer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  price NUMERIC(12,2) NOT NULL,
  location TEXT,
  work_hours TEXT,
  job_description TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

---

## Core Logic Conventions

### Trust Score

- Computed server-side only, in `lib/services/trustScore.ts`. Never trust a client-submitted score.
- Inputs: Community Verification count/diversity, Proof of Work count, customer confirmation rate, review average, on-time rate.
- No single input should be able to dominate the score (guards against one fake verifier or one bad-faith review ring). If weighting logic changes, document the reasoning in `docs/`.

### Proof of Work

- A submission is not valid until it has: before/after photo, job date, job type, and customer confirmation. Partial submissions are stored as `draft`, not counted toward Trust Score.
- Treat this as an anti-fraud surface: don't assume photos or confirmations are genuine. Flag for review rather than silently trusting on suspicious patterns (e.g. same photo reused, confirmation from same device/IP repeatedly).

### Fair Wage Estimator

- `wage_estimates` table is the source of truth. Do not hardcode wage numbers in application code.
- If no estimate exists for a given city/job/experience combination, return `null` and let the UI say "not enough data yet" — never fabricate a number.
- Warning threshold logic (customer offer below regional standard) lives in `lib/services/wageEstimator.ts`, not scattered in components.

---

## API Conventions

- REST JSON API. Thin route handlers. Validation at the request boundary with Zod.
- All business logic in `lib/services/`.
- Return meaningful data or proper HTTP status — no `{ success: true }`.
- No N+1 queries: batch-load or join when fetching a worker's Proof of Work + verifications together.

---

## Code Style

- Strict TypeScript: `"strict": true` in `tsconfig.json`.
- No `any`. No `as unknown as X` casts without a comment explaining why.
- No `console.log` in committed code — use a structured logger.
- All public functions JSDoc'd with `@param` and `@returns`.
- Run linter before every commit.
- **Imports**: always use absolute `@/` aliases. Never relative-path across directories (e.g. no `../../lib` from `components`).
  > The `@/*` alias maps to `./*` (project root), so `@/components/ui/button` resolves to `./components/ui/button`.

---

## Naming Rules

- No `data`, `result`, `response`, `payload` as variable names. Name the thing.
- No `handleX`, `processX` — say what the function does: `computeTrustScore()`, `validateProofOfWork()`.
- No `isValid` — use `hasCustomerConfirmation()`, `isWageBelowRegionalMin()`.

---

## Comments Policy

**Default: no comments.** Code self-documents via naming.

Write a comment only when:
- The *why* is non-obvious and would take a reader >30 seconds to reconstruct.
- Regex or non-trivial arithmetic (e.g. Trust Score weighting) needs plain-English context.
- `TODO` / `FIXME` with owner + context.

---

## UI Copy Rules

- No placeholder text.
- No generic button labels: "Submit", "OK", "Next". Use: "Submit proof of work", "Send verification request", "Get wage estimate".
- No generic notifications: "Saved!" → "Proof of work submitted."
- No "Coming soon" — either ship it or hide it.

---

## Performance Targets

| Metric | Target |
|---|---|
| Proof of Work submission → Trust Score update | < 3.0 seconds |
| Wage Estimator response time | < 1.0 second |
| Fraudulent Proof of Work flagged before Trust Score impact | > 95% |

---

## Testing

- Integration tests for the core loop: Profile → Proof of Work submission → Trust Score update.
- Unit tests for: Trust Score calculator, Wage Estimator lookup, Proof of Work validators.
- Mock Supabase calls in unit tests — never hit the real DB in CI.
- Coverage target: 80%+ on `lib/services/`.

```bash
npm run test
```

---

## Documentation Practices

- Be concise, specific, and value dense.
- Write for a developer new to this codebase — don't assume they know the product context above.
- Update relevant docs in `docs/` whenever a feature's behavior changes. Don't let docs go stale.
- Lint docs: `npx markdownlint docs/`

---

## Git Conventions

Commit messages follow this format:

<label>: <message>

Labels: feat, fix, chore, docs, refactor, test, style
Message: imperative, lowercase, no period

Examples:
```
feat: add trust score weighting for community verifications
fix: return null when wage estimate data is missing
chore: update tailwind config
```

---

## Error Handling

### Server-Side
- All API routes wrap logic in try/catch.
- Errors are logged via a structured logger (never `console.log`).
- API responses use a consistent error shape:

```typescript
{
  error: string;       // Human-readable message (Bahasa Indonesia for user-facing)
  code: string;        // Machine-readable code, e.g. "PROOF_NOT_FOUND"
  details?: unknown;   // Optional debug info (server-only in dev)
}
```

- Unexpected errors return 500 with a generic message: "Terjadi kesalahan. Silakan coba lagi."

### Client-Side
- Use a shared `fetchClient` wrapper that parses errors and surfaces them as typed results.
- UI shows errors in toast notifications or inline validation.
- Network errors show a retry prompt.
- Never show raw error codes or stack traces to the user.

---

## Internationalization

- Primary language: Bahasa Indonesia.
- Use `next-intl` for i18n.
- Translation files: `messages/id.json`, `messages/en.json`.
- Locale is detected from `Accept-Language` header, with `id` as default.
- All user-facing strings go through translation keys — no hardcoded Indonesian text outside messages files.
- Number/currency formatting uses `Intl.NumberFormat` with `id-ID` locale.

---

## Deployment

### Platform
Vercel (primary).

### Pipeline
Before every deploy:
1. `npm run lint`
2. `npx tsc --noEmit`
3. `npm run build`

Production is deployed from the `main` branch via Vercel Git integration.

### Environment Variables
All Supabase keys are set in Vercel Environment Variables, never committed.
`NEXT_PUBLIC_*` keys are safe for client, `SUPABASE_SERVICE_ROLE_KEY` is server-only.

---

## AI-Generated Code Guardrails

To keep the codebase human-natural and avoid AI-fingerprint patterns:

### Naming
- No `data`, `result`, `response`, `payload`, `value`, `item` as variable names.
- No placeholder names: `test1`, `example`, `foo`, `bar`, `baz`.
- Test data must use realistic Indonesian names, places, and prices.
  Good: `"Pak Budi"`, `"Jakarta Selatan"`, `150000`
  Bad:  `"John Doe"`, `"Test City"`, `100`

### Structure
- No unnecessary abstraction layers. Write what's needed, not what an AI might extrapolate.
- Prefer flat files over deep directory nesting. Don't create `index.ts` barrels.
- No premature splitting of files that could live together.

### Patterns to avoid
- Don't repeat the same guard clause pattern in every function — vary style naturally.
- No "TODO: implement" or "// will be used later" stubs.
- No overly defensive null checks on every parameter.
- No wrapping every function in try/catch — catch only where recovery is possible.
- No `console.log` (use structured logger).
- No JSDoc on trivial getters/setters — only where the *why* is non-obvious.

### Code Review
- Treat perfectly uniform code as a red flag. Humans write with natural variation.
- If two similar functions look copy-pasted, refactor or add a comment explaining why they differ.

---

## Boundaries

- ✅ **Always do:** write code in `app/`, `components/`, `lib/`, write/update docs in `docs/`, run lint + type check before finishing, keep RLS on, recompute Trust Score server-side
- ⚠️ **Ask first:** before changing DB schema/migrations, before modifying auth or role logic, before changing Trust Score weighting, before major rewrites of existing docs
- 🚫 **Never do:** commit secrets/API keys, disable RLS, trust client-submitted Trust Score or wage numbers, fabricate wage estimates when no data exists, build Growth Engine features (Career Passport, Skill Progress, Certification, Career Path) unless explicitly asked — MVP is Trust Engine + Fair Work Engine only