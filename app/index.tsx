import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link } from "expo-router";
import { supabase } from "@/lib/supabase";
import { colors, maxContentWidth, radius, spacing } from "@/lib/theme";
import { CATEGORIES, type Entry } from "@/lib/types";
import { EntryCard } from "@/components/EntryCard";

export default function BrowseScreen() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    let q = supabase
      .from("entries")
      .select("*")
      .order("status", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(100);

    if (category) q = q.eq("category", category);
    if (query.trim()) {
      const term = `%${query.trim()}%`;
      q = q.or(`primary_latin.ilike.${term},english.ilike.${term},serto.ilike.${term}`);
    }

    const { data, error } = await q;
    if (error) setError(error.message);
    setEntries(data ?? []);
    setLoading(false);
  }, [query, category]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  return (
    <View style={styles.screen}>
      <View style={styles.inner}>
        <Text style={styles.tagline}>
          A crowdsourced lexicon of spoken Suryoyo. Browse freely — log in to contribute.
        </Text>

        <TextInput
          style={styles.search}
          placeholder="Search Latin, Serto, or English…"
          placeholderTextColor={colors.muted}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
          <Chip label="All" active={category === null} onPress={() => setCategory(null)} />
          {CATEGORIES.map((c) => (
            <Chip key={c} label={c} active={category === c} onPress={() => setCategory(c)} />
          ))}
        </ScrollView>

        {loading ? (
          <ActivityIndicator style={{ marginTop: spacing.xl }} color={colors.accent} />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : entries.length === 0 ? (
          <Text style={styles.empty}>
            No entries yet{query ? ` for “${query}”` : ""}. Be the first to{" "}
            <Link href="/submit" style={styles.linkInline}>add one</Link>.
          </Text>
        ) : (
          <FlatList
            data={entries}
            keyExtractor={(e) => e.id}
            renderItem={({ item }) => <EntryCard entry={item} />}
            contentContainerStyle={{ paddingBottom: spacing.xl }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <Link href="/submit" asChild>
        <Pressable style={styles.fab}>
          <Text style={styles.fabText}>+ Submit</Text>
        </Pressable>
      </Link>
    </View>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.sand },
  inner: { flex: 1, width: "100%", maxWidth: maxContentWidth, alignSelf: "center", padding: spacing.md },
  tagline: { fontSize: 15, color: colors.inkSoft, marginBottom: spacing.md, lineHeight: 21 },
  search: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.ink,
  },
  chips: { flexGrow: 0, marginVertical: spacing.sm },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginRight: spacing.sm,
    backgroundColor: colors.card,
  },
  chipActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipText: { color: colors.inkSoft, fontSize: 13, textTransform: "capitalize" },
  chipTextActive: { color: "#fff", fontWeight: "600" },
  error: { color: colors.red, marginTop: spacing.lg },
  empty: { color: colors.muted, marginTop: spacing.xl, textAlign: "center", lineHeight: 22 },
  linkInline: { color: colors.accent, fontWeight: "600" },
  fab: {
    position: "absolute",
    right: spacing.lg,
    bottom: spacing.lg,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  fabText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
