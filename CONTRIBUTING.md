# Contributing to Lishono

Thank you for helping document Suryoyo. There are two ways to contribute, and **both matter**.

## 1. Contribute language (no coding needed)

This is 70% of the project.

- **Submit entries.** Log in and add words and phrases. Latin spelling and an English meaning are
  the only required fields — everything else (Serto, Dutch, examples, audio, dialect tag) is
  optional and welcome.
- **Vote.** An upvote means "this matches how my family says it." A downvote means "this doesn't
  seem right to me." Votes are a soft signal for reviewers, not a verdict.
- **Comment.** Context is gold: "my grandmother from Midyat says it harder." Threaded one level
  deep so this knowledge is preserved, not lost.
- **Record audio.** Real diaspora voices are the single most valuable asset in the project. If you
  speak Turoyo, your recordings are priceless.

### Reviewer tiers
`contributor` (anyone) → `trusted` (confirmed knowledge) → `reviewer` (can verify entries) →
`admin`. Reviewer status is granted by hand, ideally by a small council with representation
across church affiliations and dialect regions — never one person's call.

## 2. Contribute code

### Setup
See the [README](./README.md#getting-started).

### Ground rules
- **Never commit secrets.** `.env.local` is gitignored. No API keys, no service-role keys.
- **TypeScript, no `any` where avoidable.** Run `npm run typecheck` before opening a PR.
- **Keep the schema as the contract.** The future Expo app reads the same tables. Schema changes
  go through `supabase/` migrations and a PR discussion.
- **Small PRs.** Easier to review, easier to keep the council in the loop.

### Workflow
1. Fork and branch: `git checkout -b feature/short-description`
2. `npm run typecheck && npm run lint && npm run build`
3. Open a PR describing what changed and why.

## Code of conduct

Participation is governed by [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md). The Suryoyo community
has real divisions; this project is neutral ground for the language. Politicking, dialect
chauvinism, and sectarian gatekeeping are not welcome here.
