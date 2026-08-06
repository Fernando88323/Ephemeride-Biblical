alter table public.ephemerides
  add column if not exists bible_reference text,
  add column if not exists verse_text text,
  add column if not exists application text;
