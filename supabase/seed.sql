-- Lishono — starter seed (optional). Run AFTER schema.sql and policies.sql.
--
-- IMPORTANT: these entries are placeholders to make the app non-empty on first run.
-- They are NOT authoritative. A native-speaker reviewer should verify, correct, or
-- replace them. Serto forms especially should be double-checked by someone fluent.
-- Reference dialect: Midyat.

with shlomo as (
  insert into public.entries (primary_latin, serto, english, dutch, category, dialect_tag, status)
  values ('shlomo', 'ܫܠܡܐ', 'peace; hello', 'vrede; hallo', 'greetings', 'Midyat', 'verified')
  returning id
)
insert into public.entry_variants (entry_id, latin_form, note)
select id, x.form, x.note from shlomo,
  (values ('šlomo', 'academic transcription'),
          ('schlomo', 'German-style spelling'),
          ('shlomoh', 'with final -h')) as x(form, note);

insert into public.entries (primary_latin, serto, english, dutch, category, dialect_tag, status) values
  ('tawdi', 'ܬܘܕܝ', 'thank you', 'dank je', 'greetings', 'Midyat', 'verified'),
  ('aydarbo hat', NULL, 'how are you?', 'hoe gaat het?', 'greetings', 'Midyat', 'pending'),
  ('emo', 'ܐܡܐ', 'mother', 'moeder', 'family', 'Midyat', 'verified'),
  ('abo', 'ܐܒܐ', 'father', 'vader', 'family', 'Midyat', 'verified'),
  ('maya', 'ܡܝܐ', 'water', 'water', 'food', 'Midyat', 'verified'),
  ('lahmo', 'ܠܚܡܐ', 'bread', 'brood', 'food', 'Midyat', 'pending'),
  ('bayto', 'ܒܝܬܐ', 'house', 'huis', 'everyday', 'Midyat', 'verified'),
  ('shemsho', 'ܫܡܫܐ', 'sun', 'zon', 'nature', 'Midyat', 'pending');

-- An example sentence tied to "shlomo".
insert into public.example_sentences (entry_id, latin, serto, english)
select id, 'Shlomo, aydarbo hat?', NULL, 'Hello, how are you?'
from public.entries where primary_latin = 'shlomo' limit 1;
