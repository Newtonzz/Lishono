import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";
import { colors, fonts, radius } from "@/lib/theme";

interface FieldProps extends TextInputProps {
  label: string;
  required?: boolean;
  optional?: boolean;
  hint?: string;
  syr?: boolean;
}

export function Field({ label, required, optional, hint, syr, style, ...rest }: FieldProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.req}>  required</Text> : null}
        {optional ? <Text style={styles.opt}>  optional</Text> : null}
      </Text>
      <TextInput
        style={[styles.input, syr && styles.syrInput, style]}
        placeholderTextColor={colors.ink4}
        {...rest}
      />
      {!!hint && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 7 },
  label: { fontSize: 14, color: colors.ink, fontFamily: fonts.bodySemi },
  req: { color: colors.accent, fontSize: 12, fontFamily: fonts.body },
  opt: { color: colors.ink3, fontSize: 12, fontFamily: fonts.headItalic },
  hint: { fontSize: 13, color: colors.ink3, lineHeight: 19, fontFamily: fonts.body },
  input: {
    backgroundColor: colors.paper2,
    borderWidth: 1,
    borderColor: colors.rule2,
    borderRadius: radius.md,
    paddingHorizontal: 13,
    paddingVertical: 11,
    fontSize: 15.5,
    color: colors.ink,
    fontFamily: fonts.body,
  },
  syrInput: { fontFamily: fonts.syr, fontSize: 18, textAlign: "right", writingDirection: "rtl" },
});
