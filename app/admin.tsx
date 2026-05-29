import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { colors, maxContentWidth, radius, spacing } from "@/lib/theme";
import type { Entry, ReviewAction } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";

export default function AdminScreen() {
  const router = useRouter();
  const { profile, isReviewer, loading: authLoading } = useAuth();
  const [pending, setPending] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("entries")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true });
    setPending(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isReviewer) load();
  }, [isReviewer, load]);

  const review = async (entry: Entry, action: ReviewAction) => {
    if (!profile) return;
    const nextStatus = action === "verify" ? "verified" : action === "dispute" ? "disputed" : "pending";
    await supabase.from("reviews").insert({
      entry_id: entry.id,
      reviewer_id: profile.id,
      action,
      note: null,
    });
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
        <Text style={styles.gate}>This is the reviewer queue.</Text>
        <Text style={styles.gateSub}>
          Verification is granted by hand to a small council with representation across church
          affiliations and dialect regions. If that is you and you do not see the queue, ask an admin
          to set your role to “reviewer”.
        </Text>
        <Pressable style={styles.primary} onPress={() => router.replace("/")}>
          <Text style={styles.primaryText}>Back to the lexicon</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.inner}>
      <Text style={styles.heading}>Pending entries ({pending.length})</Text>
      <Text style={styles.note}>
        Verify what matches living usage, dispute what looks off, reject spam. Votes and comments are
        your soft signal — the call is yours.
      </Text>

      {loading ? (
        <ActivityIndicator color={colors.accent} style={{ marginTop: spacing.lg }} />
      ) : pending.length === 0 ? (
        <Text style={styles.empty}>Queue is clear. Nice.</Text>
      ) : (
        pending.map((entry) => (
          <View key={entry.id} style={styles.card}>
            <View style={styles.cardHead}>
              <Text style={styles.latin}>{entry.primary_latin}</Text>
              {entry.serto ? <Text style={styles.serto}>{entry.serto}</Text> : null}
              <StatusBadge status={entry.status} />
            </View>
            <Text style={styles.english}>{entry.english}</Text>
            {entry.dialect_tag ? <Text style={styles.meta}>dialect: {entry.dialect_tag}</Text> : null}

            <View style={styles.actions}>
              <Pressable style={[styles.action, styles.verify]} onPress={() => review(entry, "verify")}>
                <Text style={styles.actionText}>Verify</Text>
              </Pressable>
              <Pressable style={[styles.action, styles.dispute]} onPress={() => review(entry, "dispute")}>
                <Text style={styles.actionText}>Dispute</Text>
              </Pressable>
              <Pressable style={[styles.action, styles.reject]} onPress={() => review(entry, "reject")}>
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
  screen: { flex: 1, backgroundColor: colors.sand },
  inner: { width: "100%", maxWidth: maxContentWidth, alignSelf: "center", padding: spacing.md, paddingBottom: spacing.xl },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.lg, gap: spacing.md, backgroundColor: colors.sand },
  gate: { fontSize: 18, fontWeight: "700", color: colors.ink },
  gateSub: { fontSize: 14, color: colors.inkSoft, textAlign: "center", lineHeight: 20, maxWidth: 420 },
  heading: { fontSize: 20, fontWeight: "800", color: colors.ink },
  note: { fontSize: 13, color: colors.muted, lineHeight: 19, marginTop: 4, marginBottom: spacing.md },
  empty: { color: colors.muted, marginTop: spacing.lg },
  card: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, gap: 4 },
  cardHead: { flexDirection: "row", alignItems: "center", gap: spacing.sm, flexWrap: "wrap" },
  latin: { fontSize: 20, fontWeight: "700", color: colors.ink },
  serto: { fontSize: 20, color: colors.clay },
  english: { fontSize: 15, color: colors.inkSoft },
  meta: { fontSize: 12, color: colors.muted },
  actions: { flexDirection: "row", gap: spacing.sm, marginTop: spacing.sm },
  action: { flex: 1, borderRadius: radius.sm, paddingVertical: 10, alignItems: "center" },
  verify: { backgroundColor: colors.green },
  dispute: { backgroundColor: colors.amber },
  reject: { backgroundColor: colors.red },
  actionText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  primary: { backgroundColor: colors.accent, borderRadius: radius.sm, paddingVertical: 12, paddingHorizontal: spacing.lg, alignItems: "center" },
  primaryText: { color: "#fff", fontWeight: "700" },
});
