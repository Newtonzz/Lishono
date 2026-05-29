// Shared domain types for the Lishono lexicon.
// This is the contract the website and the future native app both build against.

export type UserRole = "contributor" | "trusted" | "reviewer" | "admin";
export type EntryStatus = "pending" | "verified" | "disputed";
export type ReviewAction = "verify" | "dispute" | "reject";
export type VoteValue = 1 | -1;

export interface AppUser {
  id: string;
  email: string;
  display_name: string | null;
  role: UserRole;
  dialect_background: string | null;
  created_at: string;
}

export interface Entry {
  id: string;
  primary_latin: string;
  serto: string | null;
  english: string;
  dutch: string | null;
  category: string | null;
  dialect_tag: string | null;
  status: EntryStatus;
  submitter_id: string | null;
  created_at: string;
}

export interface EntryVariant {
  id: string;
  entry_id: string;
  latin_form: string;
  note: string | null;
}

export interface ExampleSentence {
  id: string;
  entry_id: string;
  latin: string;
  serto: string | null;
  english: string | null;
  submitter_id: string | null;
}

export interface AudioRecording {
  id: string;
  entry_id: string;
  file_url: string;
  speaker_dialect: string | null;
  submitter_id: string | null;
  created_at: string;
}

export interface Vote {
  id: string;
  entry_id: string;
  user_id: string;
  value: VoteValue;
}

export interface Review {
  id: string;
  entry_id: string;
  reviewer_id: string;
  action: ReviewAction;
  note: string | null;
  created_at: string;
}

export interface Comment {
  id: string;
  entry_id: string;
  user_id: string;
  parent_comment_id: string | null;
  body: string;
  created_at: string;
}

export interface Flag {
  id: string;
  entry_id: string;
  user_id: string;
  reason: string;
  created_at: string;
}

// Minimal Database shape for the typed Supabase client.
// Regenerate with: npx supabase gen types typescript --project-id <ref> > lib/database.types.ts
export interface Database {
  public: {
    Tables: {
      users: { Row: AppUser; Insert: Partial<AppUser>; Update: Partial<AppUser> };
      entries: { Row: Entry; Insert: Partial<Entry>; Update: Partial<Entry> };
      entry_variants: { Row: EntryVariant; Insert: Partial<EntryVariant>; Update: Partial<EntryVariant> };
      example_sentences: { Row: ExampleSentence; Insert: Partial<ExampleSentence>; Update: Partial<ExampleSentence> };
      audio_recordings: { Row: AudioRecording; Insert: Partial<AudioRecording>; Update: Partial<AudioRecording> };
      votes: { Row: Vote; Insert: Partial<Vote>; Update: Partial<Vote> };
      reviews: { Row: Review; Insert: Partial<Review>; Update: Partial<Review> };
      comments: { Row: Comment; Insert: Partial<Comment>; Update: Partial<Comment> };
      flags: { Row: Flag; Insert: Partial<Flag>; Update: Partial<Flag> };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      entry_status: EntryStatus;
      review_action: ReviewAction;
    };
  };
}

export const CATEGORIES = [
  "greetings",
  "family",
  "food",
  "numbers",
  "verbs",
  "grammar",
  "religion",
  "nature",
  "everyday",
  "other",
] as const;
