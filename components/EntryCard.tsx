import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "@/lib/theme";
import type { Entry } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { Tag } from "./Tag";
import { Icon } from "./Icon";

// Manuscript entry row: hairline-ruled, bilingual head, meaning, meta tags,
// with status + votes in the aside column.
export function EntryCard({ entry, first, votes, showSyr = true }: { entry: Entry; first?: boolean; votes?: number; showSyr?: boolean }) {
  return (
    <Link href={`/entry/${entry.id}`} asChild>
      <Pressable style={[styles.row, !first && styles.ruled]}>
        <View style={styles.main}>
          <View style={styles.head}>
            <Text style={styles.latin}>{entry.primary_latin}</Text>
            {showSyr && !!entry.serto && <Text style={styles.syr}>{entry.serto}</Text>}
          </View>
          <Text style={styles.meaning} numberOfLines={2}>{entry.english}</Text>
          <View style={styles.meta}>
            {!!entry.dialect_tag && <Tag label={entry.dialect_tag} />}
            {!!entry.category && <Tag label={entry.category} />}
          </View>
        </View>
        <View style={styles.aside}>
          <StatusBadge status={entry.status} />
          {votes != null && (
            <View style={styles.votes}>
              <Icon name="arrowUp" size={15} stroke={2.2} color={colors.ink3} />
              <Text style={styles.voteCount}>{votes}</Text>
            </View>
          )}
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  ruled: { borderTopWidth: 1, borderTopColor: colors.rule },
  main: { flex: 1, minWidth: 0 },
  head: { flexDirection: "row", alignItems: "baseline", gap: 12, flexWrap: "wrap" },
  latin: { fontFamily: fonts.head, fontSize: 20, color: colors.ink },
  syr: { fontFamily: fonts.syr, fontSize: 21, color: colors.accent, writingDirection: "rtl" },
  meaning: { color: colors.ink2, fontSize: 14.5, marginTop: 3, fontFamily: fonts.body },
  meta: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 9, flexWrap: "wrap" },
  aside: { alignItems: "flex-end", gap: 8 },
  votes: { flexDirection: "row", alignItems: "center", gap: 5 },
  voteCount: { fontSize: 14, color: colors.ink2, fontFamily: fonts.bodySemi },
});
