import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { colors, fonts, maxContentWidth, radius, spacing } from "@/lib/theme";
import type { Entry, ReviewAction } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { SectionHead } from "@/components/SectionHead";

export default function AdminScreen() {
  const router = useRouter();
  const { profile, isReviewer, loading: authLoading } = useAuth();
  const [pending, setPending] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("entries").select("*").eq("status", "pending").order("created_at", { ascending: true });
    setPending(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isReviewer) load();
  }, [isReviewer, load]);

  const review = async (entry: Entry, action: ReviewAction) => {
    if (!profile) return;
    const nextStatus = action === "verify" ? "verified" : action === "dispute" ? "disputed" : "pending";
    await supabase.from("reviews").insert({ entry_id: entry.id, reviewer_id: profile.id, action, note: null });
    if (action === "reject") {
      await supabase.from("entries").delete().eq("id", entry.id);
    } else {
      await supabase.from("entries").update({ status: nextStatus }).eq("id", entry.id);
    }
    setPending((prev) => prev.filter((e) => e.id !== entry.id));
  };

  if (authLoading) return <ActivityIndicator style={{ marginTop: spacing.xl }} color={colors.accent} />;

  if (!isReviewer) {
    return (
      <View style={styles.center}>
        <Text style={styles.gate}>This is the steward review queue.</Text>
        <Text style={styles.gateSub}>
          Verification is granted by hand to a small council with representation across church affiliations and dialect regions. If that is you and you don't see the queue, ask an admin to set your role to “reviewer”.
        </Text>
        <Pressable style={styles.primary} onPress={() => router.replace("/")}>
          <Text style={styles.primaryText}>Back to the lexicon</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.inner}>
      <SectionHead title="Pending entries" syr="ܡܫܪܪܐ" right={<Text style={styles.count}>{pending.length}</Text>} />
      <Text style={styles.note}>Verify what matches living usage, dispute what looks off, reject spam. Votes and notes are your soft signal — the call is yours.</Text>

      {loading ? (
        <ActivityIndicator color={colors.accent} style={{ marginTop: spacing.lg }} />
      ) : pending.length === 0 ? (
        <Text style={styles.empty}>Queue is clear. Tawdi.</Text>
      ) : (
        pending.map((entry) => (
          <View key={entry.id} style={styles.card}>
            <View style={styles.cardHead}>
              <Text style={styles.latin}>{entry.primary_latin}</Text>
              {!!entry.serto && <Text style={styles.syr}>{entry.serto}</Text>}
              <StatusBadge status={entry.status} />
            </View>
            <Text style={styles.english}>{entry.english}</Text>
            {!!entry.dialect_tag && <Text style={styles.meta}>dialect: {entry.dialect_tag}</Text>}
            <View style={styles.actions}>
              <Pressable style={[styles.action, { backgroundColor: colors.verified }]} onPress={() => review(entry, "verify")}>
                <Text style={styles.actionText}>Verify</Text>
              </Pressable>
              <Pressable style={[styles.action, { backgroundColor: colors.pending }]} onPress={() => review(entry, "dispute")}>
                <Text style={styles.actionText}>Dispute</Text>
              </Pressable>
              <Pressable style={[styles.action, { backgroundColor: colors.accent }]} onPress={() => review(entry, "reject")}>
                <Text style={styles.actionText}>Reject</Text>
              </Pressable>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  inner: { width: "100%", maxWidth: maxContentWidth, alignSelf: "center", paddingHorizontal: 18, paddingTop: 20, paddingBottom: 48 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.lg, gap: spacing.md, backgroundColor: colors.paper },
  gate: { fontFamily: fonts.head, fontSize: 20, color: colors.ink },
  gateSub: { fontSize: 14, color: colors.ink2, textAlign: "center", lineHeight: 21, maxWidth: 420, fontFamily: fonts.body },
  count: { fontSize: 13, color: colors.ink3, fontFamily: fonts.body },
  note: { fontSize: 13.5, color: colors.ink2, lineHeight: 20, marginTop: -6, marginBottom: spacing.md, fontFamily: fonts.body },
  empty: { color: colors.ink3, marginTop: spacing.lg, fontFamily: fonts.body },
  card: { backgroundColor: colors.paper2, borderWidth: 1, borderColor: colors.rule, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, gap: 4 },
  cardHead: { flexDirection: "row", alignItems: "center", gap: spacing.sm, flexWrap: "wrap" },
  latin: { fontFamily: fonts.head, fontSize: 20, color: colors.ink },
  syr: { fontFamily: fonts.syr, fontSize: 20, color: colors.accent, writingDirection: "rtl" },
  english: { fontSize: 15, color: colors.ink2, fontFamily: fonts.body },
  meta: { fontSize: 12.5, color: colors.ink3, fontFamily: fonts.body },
  actions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm },
  action: { flex: 1, borderRadius: radius.md, paddingVertical: 10, alignItems: "center" },
  actionText: { color: colors.paper2, fontFamily: fonts.bodySemi, fontSize: 14 },
  primary: { backgroundColor: colors.accent, borderRadius: radius.md, paddingVertical: 12, paddingHorizontal: spacing.lg, alignItems: "center" },
  primaryText: { color: colors.paper2, fontFamily: fonts.bodySemi },
});
