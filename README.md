# Lishono — ܠܫܢܐ

A community project to document and teach spoken **Suryoyo (Turoyo)**.
Open source, community-owned, diaspora-built.

> The code is public. The lexicon is public. The diaspora owns the language.

---

## What this is

Lishono is a crowdsourced lexicon platform that grows into a learning app.

- **Phase 1 — The lexicon.** A crowdsourced dictionary. Anyone can browse and search without an account. Logged-in users submit entries, vote, and comment. Trusted reviewers verify entries.
- **Phase 2 — The database matures.** Verified entries and real diaspora audio accumulate and get categorized. A course quietly assembles itself in the data.
- **Phase 3 — The lessons.** Duolingo-style lessons drawn from verified entries, dialect-aware, with real diaspora-recorded audio.

This repository is **one Expo (React Native) codebase that runs on web, iOS, and Android**. The same screens that serve lishono.org today become the mobile app. There is no separate web project to keep in sync — write a screen once, ship it everywhere, all reading from the same Supabase backend.

## Scope decisions

- **Variety:** Turoyo (spoken Suryoyo) first. Classical Syriac (Kthobonoyo) as a possible later track.
- **Scripts:** Both Serto (ܣܪܛܐ) and Latin transliteration. Latin required on submission (lower friction), Serto optional. Both displayed side by side.
- **Orthography:** All Latin spellings accepted. We do not enforce one convention — see [`ORTHOGRAPHY.md`](./ORTHOGRAPHY.md). Spellings of the same word are grouped via `entry_variants`.
- **Reference dialect:** Midyat is the stated primary. Dialect variation is a feature — entries are tagged, not flattened.

## Tech stack

| Layer | Choice |
|---|---|
| App (web + iOS + Android) | Expo + React Native + Expo Router, one codebase |
| Language | TypeScript |
| Database, auth, file storage | Supabase (Postgres) |
| Web hosting | Vercel / Netlify (static export of the Expo web build) |
| Native distribution | Expo / EAS Build → App Store + Play Store |

**Why one Expo codebase?** Because the destination is a mobile app, and Expo lets the website and the app *be the same code*. `expo-router` gives file-based routing that compiles to real native screens and to a web app. The shared contract underneath everything is the Supabase schema in [`supabase/`](./supabase).

**The one honest tradeoff:** Expo's web output is a client-rendered SPA, which is weaker for SEO than a server-rendered site. For a public dictionary, discoverability matters — so if organic search traffic becomes a priority later, a thin server-rendered marketing/entry layer can be added in front without touching the app. For now, code reuse with the native app wins.

## Getting started

### 1. Prerequisites
- Node.js 18.18+ (20+ recommended)
- A free [Supabase](https://supabase.com) project
- For phones: the **Expo Go** app, or an EAS dev build

### 2. Install
```bash
git clone https://github.com/Newtonzz/Lishono.git
cd Lishono
npm install
```

### 3. Configure Supabase
1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run the files in order:
   - `supabase/schema.sql` — tables, indexes, signup trigger
   - `supabase/policies.sql` — row-level security
   - `supabase/seed.sql` — a handful of starter entries (optional; placeholders, verify them)
3. Under **Authentication → Providers**, enable **Email** and **Google**.
4. Copy `.env.example` to `.env.local` and fill in the values from **Project Settings → API**:
```bash
cp .env.example .env.local
```

### 4. Run

```bash
npm run web      # open the site at http://localhost:8081
npm run ios      # iOS simulator (macOS)
npm run android  # Android emulator
npm start        # dev server + QR code for Expo Go on a physical phone
```

### 5. Ship the website
```bash
npm run build:web   # static export into dist/
```
Deploy `dist/` to Vercel or Netlify. Point lishono.org at it.

## Project structure

```
app/                      expo-router file-based routes (web + native)
  _layout.tsx             Root stack, header, auth provider
  index.tsx               Browse + search
  submit.tsx              Submit an entry (login required)
  entry/[id].tsx          Entry detail: variants, examples, votes, comments
  login.tsx               Email magic link + Google auth
  admin.tsx               Reviewer verification queue
components/               StatusBadge, EntryCard, Field
lib/
  supabase.ts             Supabase client (AsyncStorage on native, web on web)
  auth.tsx                Session + profile context, useAuth() hook
  types.ts                Domain types — the contract for app + future lessons
  theme.ts                Shared colors, spacing, radius
supabase/
  schema.sql              Tables + indexes + signup trigger
  policies.sql            Row-level security
  seed.sql                Starter data (placeholder, verify)
```

## Contributing

This project *is* its community. Code is ~30% of the work; content and verification by native speakers are the other 70%. See [`CONTRIBUTING.md`](./CONTRIBUTING.md) and our [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md).

## Licensing

- **Code:** [GNU AGPL-3.0-or-later](./LICENSE). Network use counts as distribution — anyone running a modified copy must publish their source. This prevents closed-source forks.
- **Lexicon data:** intended for release under **Creative Commons CC-BY-SA 4.0** (like Wiktionary) once it reaches meaningful scale. The data belongs to the community.

## Status

Early. Phase 1, pre-launch. Lesson work begins once the lexicon reaches roughly **1,000 verified entries and 5+ active reviewers**.

ܒܫܝܢܐ — go in peace.
