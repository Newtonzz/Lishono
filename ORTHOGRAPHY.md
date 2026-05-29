# Orthography stance

Turoyo has no single agreed Latin spelling. Different families, villages, churches, and
academic traditions write the same word differently. **This is expected, and Lishono does not
try to settle it.**

## Our position

1. **We accept all Latin spellings.** `shlomo`, `šlomo`, and `schlomo` are all welcome. Forcing
   one convention would turn away contributors, and contributors are the project.

2. **We group, we do not correct.** Spellings of the same word are linked through the
   `entry_variants` table. One canonical entry, many recorded variant forms, each with an
   optional note ("German-style", "academic transcription", "as my grandmother writes it").

3. **One primary form per entry, chosen pragmatically.** Each entry has a `primary_latin` used
   for display and search ranking. It is a presentation choice, not a ruling on correctness. The
   reviewing council picks it; variants preserve everything else.

4. **Serto is optional but encouraged.** ܣܪܛܐ script is shown alongside Latin when provided.

5. **We stay neutral.** Maintainers and reviewers do not declare one Latin convention "right".
   Editorial consistency in the *interface* is fine; prescriptivism about *the language* is not.

## Reference dialect

The stated primary reference dialect is **Midyat**. This is openly declared, not hidden. Other
dialects are tagged via `dialect_tag` on each entry and `speaker_dialect` on each recording.
Dialect variation is treated as data worth keeping, never as error to be flattened.

## Why this matters

The fastest way to kill a community language project is to make a speaker feel their family's
way of saying or spelling something is "wrong". Lishono's job is to record the language as it is
actually spoken across the diaspora — not to issue verdicts.
