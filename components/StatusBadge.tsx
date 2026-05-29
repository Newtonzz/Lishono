import { StyleSheet, Text, View } from "react-native";
import { colors } from "@/lib/theme";
import type { EntryStatus } from "@/lib/types";

const MAP: Record<string, { label: string; color: string; tint: string }> = {
  verified: { label: "Verified", color: colors.verified, tint: colors.verifiedTint },
  pending: { label: "Pending", color: colors.pending, tint: colors.pendingTint },
  disputed: { label: "Disputed", color: colors.accent, tint: colors.accentTint2 },
};

export function StatusBadge({ status }: { status: EntryStatus }) {
  const s = MAP[status] ?? MAP.pending;
  return (
    <View style={[styles.badge, { backgroundColor: s.tint }]}>
      <View style={[styles.dot, { backgroundColor: s.color }]} />
      <Text style={[styles.text, { color: s.color }]}>{s.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 2,
    alignSelf: "flex-start",
  },
  dot: { width: 5, height: 5, borderRadius: 3 },
  text: { fontSize: 11, fontWeight: "600", letterSpacing: 0.5, textTransform: "uppercase" },
});
