import { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { colors, maxContentWidth, radius, spacing } from "@/lib/theme";
import { CATEGORIES } from "@/lib/types";
import { Field } from "@/components/Field";

export default function SubmitScreen() {
  const router = useRouter();
  const { session } = useAuth();

  const [primaryLatin, setPrimaryLatin] = useState("");
  const [english, setEnglish] = useState("");
  const [serto, setSerto] = useState("");
  const [dutch, setDutch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [dialectTag, setDialectTag] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const notify = (text: string) => {
    setError(text);
    if (Platform.OS !== "web") Alert.alert(text);
  };

  if (!session) {
    return (
      <View style={styles.center}>
        <Text style={styles.gateText}>You need to log in to submit an entry.</Text>
        <Pressable style={styles.primary} onPress={() => router.push("/login")}>
          <Text style={styles.primaryText}>Log in</Text>
        </Pressable>
      </View>
    );
  }

  const submit = async () => {
    if (!primaryLatin.trim() || !english.trim()) {
      return notify("Latin spelling and English meaning are required.");
    }
    setBusy(true);
    setError(null);
    const { data, error } = await supabase
      .from("entries")
      .insert({
        primary_latin: primaryLatin.trim(),
        english: english.trim(),
        serto: serto.trim() || null,
        dutch: dutch.trim() || null,
        category,
        dialect_tag: dialectTag.trim() || null,
        status: "pending",
        submitter_id: session.user.id,
      })
      .select("id")
      .single();
    setBusy(false);
    if (error) return notify(error.message);
    if (data) router.replace(`/entry/${data.id}`);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.inner}>
      <Text style={styles.note}>
        Only Latin spelling and English meaning are required. Everything else is optional — add
        what you know. Your entry posts immediately with a “pending” badge until a reviewer verifies it.
      </Text>

      <Field
        label="Latin spelling"
        required
        hint="However you or your family writes it. We accept all conventions."
        placeholder="shlomo"
        value={primaryLatin}
        onChangeText={setPrimaryLatin}
        autoCapitalize="none"
      />
      <Field
        label="English meaning"
        required
        placeholder="hello / peace"
        value={english}
        onChangeText={setEnglish}
      />
      <Field
        label="Serto script (ܣܪܛܐ)"
        hint="Optional. Shown alongside the Latin."
        placeholder="ܫܠܡܐ"
        value={serto}
        onChangeText={setSerto}
      />
      <Field label="Dutch meaning" placeholder="hallo / vrede" value={dutch} onChangeText={setDutch} />

      <Text style={styles.label}>Category</Text>
      <View style={styles.chipWrap}>
        {CATEGORIES.map((c) => (
          <Pressable
            key={c}
            onPress={() => setCategory(category === c ? null : c)}
            style={[styles.chip, category === c && styles.chipActive]}
          >
            <Text style={[styles.chipText, category === c && styles.chipTextActive]}>{c}</Text>
          </Pressable>
        ))}
      </View>

      <Field
        label="Dialect tag"
        hint="e.g. Midyat, Kfarze, Anhel. The reference dialect is Midyat."
        placeholder="Midyat"
        value={dialectTag}
        onChangeText={setDialectTag}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={[styles.primary, busy && styles.disabled]} onPress={submit} disabled={busy}>
        <Text style={styles.primaryText}>{busy ? "Submitting…" : "Submit entry"}</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.sand },
  inner: { width: "100%", maxWidth: maxContentWidth, alignSelf: "center", padding: spacing.md, paddingBottom: spacing.xl },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.lg, gap: spacing.md, backgroundColor: colors.sand },
  gateText: { fontSize: 16, color: colors.inkSoft, textAlign: "center" },
  note: { fontSize: 13, color: colors.muted, lineHeight: 19, marginBottom: spacing.md },
  label: { fontSize: 14, fontWeight: "600", color: colors.ink, marginBottom: 6 },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm, marginBottom: spacing.md },
  chip: { borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6, backgroundColor: colors.card },
  chipActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  chipText: { color: colors.inkSoft, fontSize: 13, textTransform: "capitalize" },
  chipTextActive: { color: "#fff", fontWeight: "600" },
  error: { color: colors.red, marginBottom: spacing.md },
  primary: { backgroundColor: colors.accent, borderRadius: radius.sm, paddingVertical: 14, alignItems: "center", marginTop: spacing.sm },
  primaryText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  disabled: { opacity: 0.6 },
});
