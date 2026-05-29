import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "@/lib/theme";
import type { Entry } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

export function EntryCard({ entry }: { entry: Entry }) {
  return (
    <Link href={`/entry/${entry.id}`} asChild>
      <Pressable style={styles.card}>
        <View style={styles.topRow}>
          <Text style={styles.latin}>{entry.primary_latin}</Text>
          {entry.serto ? <Text style={styles.serto}>{entry.serto}</Text> : null}
        </View>
        <Text style={styles.english}>{entry.english}</Text>
        <View style={styles.metaRow}>
          <StatusBadge status={entry.status} />
          {entry.dialect_tag ? <Text style={styles.tag}>{entry.dialect_tag}</Text> : null}
          {entry.category ? <Text style={styles.tag}>{entry.category}</Text> : null}
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: 6,
  },
  topRow: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", gap: spacing.sm },
  latin: { fontSize: 19, fontWeight: "700", color: colors.ink },
  serto: { fontSize: 20, color: colors.clay },
  english: { fontSize: 15, color: colors.inkSoft },
  metaRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: 2, flexWrap: "wrap" },
  tag: { fontSize: 12, color: colors.muted },
});
