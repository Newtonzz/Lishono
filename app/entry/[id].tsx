import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { colors, maxContentWidth, radius, spacing } from "@/lib/theme";
import type { Comment, Entry, EntryVariant, ExampleSentence } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";

export default function EntryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { session } = useAuth();

  const [entry, setEntry] = useState<Entry | null>(null);
  const [variants, setVariants] = useState<EntryVariant[]>([]);
  const [examples, setExamples] = useState<ExampleSentence[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [score, setScore] = useState(0);
  const [myVote, setMyVote] = useState<number>(0);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const [e, v, ex, c, votes] = await Promise.all([
      supabase.from("entries").select("*").eq("id", id).single(),
      supabase.from("entry_variants").select("*").eq("entry_id", id),
      supabase.from("example_sentences").select("*").eq("entry_id", id),
      supabase.from("comments").select("*").eq("entry_id", id).order("created_at", { ascending: true }),
      supabase.from("votes").select("user_id,value").eq("entry_id", id),
    ]);
    setEntry(e.data ?? null);
    setVariants(v.data ?? []);
    setExamples(ex.data ?? []);
    setComments(c.data ?? []);
    const all = votes.data ?? [];
    setScore(all.reduce((sum, x: { value: number }) => sum + x.value, 0));
    const mine = all.find((x: { user_id: string }) => x.user_id === session?.user?.id);
    setMyVote(mine?.value ?? 0);
    setLoading(false);
  }, [id, session?.user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const vote = async (value: 1 | -1) => {
    if (!session) return router.push("/login");
    const next = myVote === value ? 0 : value;
    if (next === 0) {
      await supabase.from("votes").delete().match({ entry_id: id, user_id: session.user.id });
    } else {
      await supabase.from("votes").upsert(
        { entry_id: id as string, user_id: session.user.id, value: next },
        { onConflict: "entry_id,user_id" }
      );
    }
    load();
  };

  const postComment = async () => {
    if (!session) return router.push("/login");
    if (!draft.trim()) return;
    await supabase.from("comments").insert({
      entry_id: id as string,
      user_id: session.user.id,
      body: draft.trim(),
      parent_comment_id: null,
    });
    setDraft("");
    load();
  };

  if (loading) return <ActivityIndicator style={{ marginTop: spacing.xl }} color={colors.accent} />;
  if (!entry) return <Text style={styles.missing}>Entry not found.</Text>;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.inner}>
      <View style={styles.headRow}>
        <Text style={styles.latin}>{entry.primary_latin}</Text>
        <StatusBadge status={entry.status} />
      </View>
      {entry.serto ? <Text style={styles.serto}>{entry.serto}</Text> : null}
      <Text style={styles.english}>{entry.english}</Text>
      {entry.dutch ? <Text style={styles.secondary}>Dutch: {entry.dutch}</Text> : null}

      <View style={styles.tagRow}>
        {entry.dialect_tag ? <Text style={styles.tag}>{entry.dialect_tag}</Text> : null}
        {entry.category ? <Text style={styles.tag}>{entry.category}</Text> : null}
      </View>

      <View style={styles.voteRow}>
        <Pressable onPress={() => vote(1)} style={[styles.voteBtn, myVote === 1 && styles.voteUp]}>
          <Text style={[styles.voteText, myVote === 1 && styles.voteTextActive]}>▲ matches</Text>
        </Pressable>
        <Text style={styles.score}>{score > 0 ? `+${score}` : score}</Text>
        <Pressable onPress={() => vote(-1)} style={[styles.voteBtn, myVote === -1 && styles.voteDown]}>
          <Text style={[styles.voteText, myVote === -1 && styles.voteTextActive]}>▼ off</Text>
        </Pressable>
      </View>

      {variants.length > 0 && (
        <Section title="Spelling variants">
          {variants.map((v) => (
            <Text key={v.id} style={styles.listItem}>
              <Text style={styles.bold}>{v.latin_form}</Text>
              {v.note ? <Text style={styles.secondary}>  — {v.note}</Text> : null}
            </Text>
          ))}
        </Section>
      )}

      {examples.length > 0 && (
        <Section title="Examples">
          {examples.map((ex) => (
            <View key={ex.id} style={styles.example}>
              <Text style={styles.exLatin}>{ex.latin}</Text>
              {ex.serto ? <Text style={styles.exSerto}>{ex.serto}</Text> : null}
              {ex.english ? <Text style={styles.secondary}>{ex.english}</Text> : null}
            </View>
          ))}
        </Section>
      )}

      <Section title={`Comments (${comments.length})`}>
        {comments.length === 0 ? (
          <Text style={styles.secondary}>No comments yet. Add context your family knows.</Text>
        ) : (
          comments.map((c) => (
            <View key={c.id} style={styles.comment}>
              <Text style={styles.commentBody}>{c.body}</Text>
            </View>
          ))
        )}
        <TextInput
          style={styles.commentInput}
          placeholder={session ? "Add context (“my grandmother from Midyat says it harder”)" : "Log in to comment"}
          placeholderTextColor={colors.muted}
          value={draft}
          onChangeText={setDraft}
          editable={!!session}
          multiline
        />
        <Pressable style={styles.primary} onPress={postComment}>
          <Text style={styles.primaryText}>Post comment</Text>
        </Pressable>
      </Section>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.sand },
  inner: { width: "100%", maxWidth: maxContentWidth, alignSelf: "center", padding: spacing.md, paddingBottom: spacing.xl },
  missing: { padding: spacing.lg, color: colors.muted },
  headRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm },
  latin: { fontSize: 30, fontWeight: "800", color: colors.ink },
  serto: { fontSize: 30, color: colors.clay, marginTop: 2 },
  english: { fontSize: 18, color: colors.inkSoft, marginTop: spacing.sm },
  secondary: { fontSize: 14, color: colors.muted },
  tagRow: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm, flexWrap: "wrap" },
  tag: { fontSize: 13, color: colors.muted, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 },
  voteRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginTop: spacing.lg },
  voteBtn: { borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: 8, backgroundColor: colors.card },
  voteUp: { borderColor: colors.green, backgroundColor: "#eaf6ef" },
  voteDown: { borderColor: colors.red, backgroundColor: "#fcebeb" },
  voteText: { color: colors.inkSoft, fontWeight: "600", fontSize: 13 },
  voteTextActive: { color: colors.ink },
  score: { fontSize: 18, fontWeight: "700", color: colors.ink, minWidth: 36, textAlign: "center" },
  section: { marginTop: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: colors.ink, marginBottom: spacing.sm },
  listItem: { fontSize: 15, color: colors.inkSoft, marginBottom: 4 },
  bold: { fontWeight: "700", color: colors.ink },
  example: { marginBottom: spacing.md },
  exLatin: { fontSize: 16, color: colors.ink },
  exSerto: { fontSize: 17, color: colors.clay },
  comment: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, padding: spacing.md, marginBottom: spacing.sm },
  commentBody: { fontSize: 14, color: colors.ink, lineHeight: 20 },
  commentInput: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm, padding: spacing.md, fontSize: 14, color: colors.ink, minHeight: 60, marginTop: spacing.sm, textAlignVertical: "top" },
  primary: { backgroundColor: colors.accent, borderRadius: radius.sm, paddingVertical: 10, alignItems: "center", marginTop: spacing.sm },
  primaryText: { color: "#fff", fontWeight: "700" },
});
