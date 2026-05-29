import { StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "@/lib/theme";

// Section header row: serif title, optional Serto, a hairline rule, a tiny count.
export function SectionHead({ title, syr, right }: { title: string; syr?: string; right?: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {!!syr && <Text style={styles.syr}>{syr}</Text>}
      <View style={styles.rule} />
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "baseline", gap: 12, marginBottom: 16 },
  title: { fontFamily: fonts.head, fontSize: 20, color: colors.ink },
  syr: { fontFamily: fonts.syr, fontSize: 18, color: colors.ink3, writingDirection: "rtl" },
  rule: { flex: 1, height: 1, backgroundColor: colors.rule, transform: [{ translateY: -3 }] },
});
