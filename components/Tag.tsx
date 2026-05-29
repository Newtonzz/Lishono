import { StyleSheet, Text, View } from "react-native";
import { colors, fonts, radius } from "@/lib/theme";
import { REGIONS } from "@/lib/regions";

export function Tag({ label, flag }: { label: string; flag?: string }) {
  return (
    <View style={styles.tag}>
      {!!flag && <Text style={styles.flag}>{flag}</Text>}
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

export function RegionTag({ id }: { id: string }) {
  const r = REGIONS[id];
  if (!r) return <Tag label={id} />;
  return <Tag label={r.name} flag={r.flag} />;
}

// Italic part-of-speech, manuscript style.
export function Pos({ children }: { children: string }) {
  return <Text style={styles.pos}>{children}</Text>;
}

const styles = StyleSheet.create({
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    borderColor: colors.rule2,
    borderRadius: radius.xs,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  flag: { fontSize: 12 },
  label: { fontSize: 12.5, color: colors.ink2, fontFamily: fonts.body },
  pos: { fontFamily: fonts.headItalic, fontSize: 14, color: colors.ink3 },
});
