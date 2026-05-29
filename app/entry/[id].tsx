import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { colors, fonts, maxContentWidth, radius, spacing } from "@/lib/theme";
import type { Comment, Entry, EntryVariant, ExampleSentence } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { Tag, Pos } from "@/components/Tag";
import { SectionHead } from "@/components/SectionHead";
import { AudioButton } from "@/components/AudioButton";
import { Icon } from "@/components/Icon";

export default function EntryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { session } = useAuth();

  const [entry, setEntry] = useState<Entry | null>(null);
  const [variants, setVariants] = useState<EntryVariant[]>([]);
  const [examples, setExamples] = useState<ExampleSentence[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [score, setScore] = useState(0);
  const [myVote, setMyVote] = useState(0);
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

  const vote = async () => {
    if (!session) return router.push("/login");
    const next = myVote === 1 ? 0 : 1;
    if (next === 0) {
      await supabase.from("votes").delete().match({ entry_id: id, user_id: session.user.id });
    } else {
      await supabase.from("votes").upsert(
        { entry_id: id as string, user_id: session.user.id, value: 1 },
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

  const verified = entry.status === "verified";

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.inner}>
      <Pressable style={styles.crumb} onPress={() => router.push("/")}>
        <Icon name="chevronLeft" size={15} color={colors.ink3} />
        <Text style={styles.crumbText}>All words</Text>
      </Pressable>

      {/* Hero */}
      <View style={styles.headline}>
        <View style={styles.word}>
          <Text style={styles.latin}>{entry.primary_latin}</Text>
          {!!entry.serto && <Text style={styles.syr}>{entry.serto}</Text>}
        </View>
        <View style={styles.heroAside}>
          <StatusBadge status={entry.status} />
          <AudioButton />
        </View>
      </View>

      <View style={styles.pron}>
        <Pos>{entry.category ?? "word"}</Pos>
        <Text style={styles.dot}>·</Text>
        <Tag label={entry.dialect_tag ?? "General"} />
      </View>

      <View style={styles.verLine}>
        {verified ? (
          <Icon name="check" size={16} stroke={2.5} color={colors.verified} />
        ) : (
          <View style={styles.pendDot} />
        )}
        <Text style={styles.verText}>
          {verified ? "Verified entry" : "Pending — awaiting steward review"}
        </Text>
      </View>

      {/* Meaning */}
      <View style={styles.section}>
        <SectionHead title="Meaning" syr="ܣܘܟܠܐ" />
        <View>
          <DefLang flag="🇬🇧" text={entry.english} first />
          {!!entry.dutch && <DefLang flag="🇳🇱" text={entry.dutch} />}
        </View>
      </View>

      {/* Variants + heard in */}
      {(variants.length > 0 || entry.dialect_tag) && (
        <View style={styles.section}>
          {variants.length > 0 && (
            <View style={styles.kvRow}>
              <Text style={styles.kvKey}>VARIANTS</Text>
              <View style={styles.variantList}>
                {variants.map((v) => (
                  <Text key={v.id} style={styles.variant}>{v.latin_form}</Text>
                ))}
              </View>
            </View>
          )}
          <View style={styles.kvRow}>
            <Text style={styles.kvKey}>HEARD IN</Text>
            <View style={styles.variantList}>
              <Tag label={entry.dialect_tag ?? "Tur Abdin"} />
            </View>
          </View>
        </View>
      )}

      {/* Examples */}
      {examples.length > 0 && (
        <View style={styles.section}>
          <SectionHead title="In a sentence" syr="ܒܚܕ ܡܡܠܠܐ" />
          {examples.map((ex, i) => (
            <View key={ex.id} style={[styles.example, i > 0 && styles.exampleRuled]}>
              {!!ex.serto && <Text style={styles.exSyr}>{ex.serto}</Text>}
              <Text style={styles.exLatin}>{ex.latin}</Text>
              {!!ex.english && <Text style={styles.exTrans}>🇬🇧  {ex.english}</Text>}
            </View>
          ))}
        </View>
      )}

      {/* Votes */}
      <View style={styles.section}>
        <View style={styles.votebar}>
          <Pressable style={[styles.voteBtn, myVote === 1 && styles.voteCast]} onPress={vote}>
            <Icon name="arrowUp" size={16} stroke={2.4} color={myVote === 1 ? colors.accentStrong : colors.ink2} />
            <Text style={[styles.voteCount, myVote === 1 && styles.voteCastText]}>{score}</Text>
            <Text style={[styles.voteLabel, myVote === 1 && styles.voteCastText]}>{myVote === 1 ? "Upvoted" : "Useful"}</Text>
          </Pressable>
          <Text style={styles.voteHint}>Upvotes help stewards prioritise which words to verify next.</Text>
        </View>
      </View>

      {/* Discussion */}
      <View style={styles.section}>
        <SectionHead title="Discussion" syr="ܡܡܠܠܐ" right={<Text style={styles.count}>{comments.length} {comments.length === 1 ? "note" : "notes"}</Text>} />
        {comments.length === 0 ? (
          <Text style={styles.noNotes}>No notes yet. Share a regional spelling, a memory, or a correction.</Text>
        ) : (
          comments.map((c) => (
            <View key={c.id} style={styles.comment}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{(c.body[0] || "·").toUpperCase()}</Text>
              </View>
              <View style={styles.commentBody}>
                <Text style={styles.commentText}>{c.body}</Text>
              </View>
            </View>
          ))
        )}
        <View style={styles.commentBox}>
          <TextInput
            style={styles.commentInput}
            placeholder={session ? "Add a note — a variant, a memory, a correction…" : "Log in to add a note"}
            placeholderTextColor={colors.ink4}
            value={draft}
            onChangeText={setDraft}
            editable={!!session}
            multiline
          />
          <Pressable style={[styles.postBtn, !draft.trim() && styles.postDisabled]} onPress={postComment} disabled={!draft.trim()}>
            <Text style={styles.postText}>Post note</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

function DefLang({ flag, text, first }: { flag: string; text: string; first?: boolean }) {
  return (
    <View style={[styles.defLang, !first && styles.defRuled]}>
      <Text style={styles.dlFlag}>{flag}</Text>
      <Text style={styles.dlText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  inner: { width: "100%", maxWidth: maxContentWidth, alignSelf: "center", paddingHorizontal: 18, paddingTop: 16, paddingBottom: 48, gap: 28 },
  missing: { padding: spacing.lg, color: colors.ink3, fontFamily: fonts.body },

  crumb: { flexDirection: "row", alignItems: "center", gap: 7, alignSelf: "flex-start" },
  crumbText: { fontSize: 13.5, color: colors.ink3, fontFamily: fonts.body },

  headline: { flexDirection: "row", alignItems: "flex-start", gap: 20, flexWrap: "wrap" },
  word: { gap: 6, flexShrink: 1 },
  latin: { fontFamily: fonts.head, fontSize: 52, color: colors.ink, letterSpacing: -0.5 },
  syr: { fontFamily: fonts.syr, fontSize: 48, color: colors.accent, writingDirection: "rtl", lineHeight: 64 },
  heroAside: { marginLeft: "auto", alignItems: "flex-end", gap: 12 },

  pron: { flexDirection: "row", alignItems: "center", gap: 12, flexWrap: "wrap" },
  dot: { color: colors.rule3 },

  verLine: { flexDirection: "row", alignItems: "center", gap: 9 },
  pendDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.pending },
  verText: { fontSize: 14, color: colors.ink2, fontFamily: fonts.body },

  section: {},
  defLang: { flexDirection: "row", gap: 10, alignItems: "baseline", paddingVertical: 10 },
  defRuled: { borderTopWidth: 1, borderTopColor: colors.rule },
  dlFlag: { fontSize: 15, width: 22 },
  dlText: { fontSize: 17, color: colors.ink, flex: 1, fontFamily: fonts.body },

  kvRow: { flexDirection: "row", gap: 22, alignItems: "baseline", marginBottom: 16 },
  kvKey: { fontSize: 12.5, color: colors.ink3, letterSpacing: 1, fontFamily: fonts.bodySemi, width: 84 },
  variantList: { flexDirection: "row", flexWrap: "wrap", gap: 10, flex: 1 },
  variant: { fontFamily: fonts.head, fontSize: 16, color: colors.ink },

  example: { paddingVertical: 16, gap: 7 },
  exampleRuled: { borderTopWidth: 1, borderTopColor: colors.rule },
  exSyr: { fontFamily: fonts.syr, fontSize: 22, color: colors.ink, writingDirection: "rtl", lineHeight: 36 },
  exLatin: { fontFamily: fonts.headItalic, fontSize: 17, color: colors.ink },
  exTrans: { fontSize: 15, color: colors.ink2, fontFamily: fonts.body },

  votebar: { flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap" },
  voteBtn: { flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: colors.paper2, borderWidth: 1, borderColor: colors.rule2, borderRadius: radius.md, paddingVertical: 9, paddingHorizontal: 14 },
  voteCast: { backgroundColor: colors.accentTint, borderColor: colors.accent },
  voteCount: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.ink2 },
  voteLabel: { fontFamily: fonts.bodySemi, fontSize: 14, color: colors.ink2 },
  voteCastText: { color: colors.accentStrong },
  voteHint: { color: colors.ink2, fontSize: 13.5, fontFamily: fonts.body, flex: 1 },

  count: { fontSize: 13, color: colors.ink3, fontFamily: fonts.body },
  noNotes: { color: colors.ink3, fontSize: 14.5, paddingVertical: 8, fontFamily: fonts.body },
  comment: { flexDirection: "row", gap: 13, paddingVertical: 16, borderTopWidth: 1, borderTopColor: colors.rule },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.ink2, alignItems: "center", justifyContent: "center" },
  avatarText: { color: colors.paper2, fontFamily: fonts.headSemi, fontSize: 13 },
  commentBody: { flex: 1 },
  commentText: { fontSize: 15, color: colors.ink, lineHeight: 22, fontFamily: fonts.body },

  commentBox: { gap: 10, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.rule, alignItems: "flex-end" },
  commentInput: { width: "100%", minHeight: 60, backgroundColor: colors.paper2, borderWidth: 1, borderColor: colors.rule2, borderRadius: radius.md, padding: 13, fontSize: 15, color: colors.ink, fontFamily: fonts.body, textAlignVertical: "top" },
  postBtn: { backgroundColor: colors.accent, borderRadius: radius.md, paddingVertical: 8, paddingHorizontal: 16 },
  postDisabled: { opacity: 0.5 },
  postText: { color: colors.paper2, fontFamily: fonts.bodySemi, fontSize: 14 },
});
