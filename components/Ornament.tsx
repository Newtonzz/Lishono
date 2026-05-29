import { StyleSheet, View } from "react-native";
import { colors } from "@/lib/theme";
import { Stars4 } from "./Emblem";

// Four-star tablet flanked by faint rules — the manuscript colophon divider.
export function Ornament({ width = 64, rules = true, color = colors.gold }: { width?: number; rules?: boolean; color?: string }) {
  return (
    <View style={styles.wrap}>
      {rules && <View style={styles.rule} />}
      <Stars4 size={width} color={color} />
      {rules && <View style={styles.rule} />}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 14 },
  rule: { height: 1, flex: 1, maxWidth: 120, backgroundColor: colors.rule2 },
});
