import { Text, View, StyleSheet } from "react-native";
import { statusColor } from "@/lib/theme";
import type { EntryStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: EntryStatus }) {
  const color = statusColor[status] ?? "#888";
  return (
    <View style={[styles.badge, { borderColor: color }]}>
      <Text style={[styles.text, { color }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  text: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
