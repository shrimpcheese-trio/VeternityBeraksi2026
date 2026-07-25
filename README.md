# Upahku — Employment Trust Platform

Platform for Indonesian informal workers to build verifiable professional reputation.

## Tech

| Layer | Stack |
|-------|-------|
| Framework | Next.js 16 (App Router) |
| UI | shadcn/ui + Tailwind CSS v4 |
| Auth | Supabase Auth (email, phone, Google OAuth) |
| Database | Supabase (Postgres) |

## Auth

| Method | Register | Login |
|--------|----------|-------|
| Email | email + password | email + password |
| Phone | phone + password → SMS OTP verify | phone + password **or** phone + OTP |
| Google | OAuth — auto-creates account | OAuth — same flow |

After registration, users complete their profile at `/profile/setup` and are redirected to their role-based dashboard (`/worker`, `/employer`, `/admin`).

## Getting Started

```bash
npm install
cp .env.example .env.local   # fill in Supabase credentials
npm run dev
```

### Configure Supabase Dashboard

1. **Google OAuth** — Authentication → Providers → Google: enable, add Client ID + Secret
2. **Phone Auth** — Authentication → Settings → SMS: enable phone auth with SMS provider
3. **Redirect URLs** — add `http://localhost:3000/auth/callback` to Auth → URL Configuration

## Project Structure

```
app/
  (auth)/         — login, register pages
  auth/           — oauth callback, email confirmation routes
  worker/         — worker dashboard (role-gated)
  employer/       — employer dashboard (role-gated)
  admin/          — admin dashboard (role-gated)
  profile/setup   — post-registration profile completion
lib/
  actions/auth.ts — server actions for signup, login, OTP, logout
  schemas/auth.ts — Zod validation schemas
  supabase/       — client, server, admin, proxy session helpers
components/shared/ — auth-layout, login-form, register-form, google-auth-button
```

## Commit

```bash
npm run lint && npx tsc --noEmit
```
