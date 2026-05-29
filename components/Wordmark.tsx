import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "@/lib/theme";

// Bilingual wordmark — Lishono │ ܠܫܢܐ — side by side.
export function Wordmark({ scale = 1 }: { scale?: number }) {
  return (
    <Link href="/" asChild>
      <Pressable style={styles.wrap} accessibilityLabel="Lishono home">
        <Text style={[styles.latin, { fontSize: 25 * scale }]}>Lishono</Text>
        <View style={styles.rule} />
        <Text style={[styles.syr, { fontSize: 27 * scale }]}>ܠܫܢܐ</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", gap: 12 },
  latin: { fontFamily: fonts.head, color: colors.ink, letterSpacing: -0.3 },
  rule: { width: 1, alignSelf: "stretch", backgroundColor: colors.rule2, marginVertical: 4 },
  syr: { fontFamily: fonts.syr, color: colors.accent, writingDirection: "rtl" },
});
