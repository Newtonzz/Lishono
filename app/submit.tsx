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
import { colors, fonts, maxContentWidth, radius, spacing } from "@/lib/theme";
import { REGIONS } from "@/lib/regions";
import { Field } from "@/components/Field";
import { Icon } from "@/components/Icon";
import { Ornament } from "@/components/Ornament";

const POS = ["noun", "verb", "adjective", "phrase", "interjection", "other"];

export default function SubmitScreen() {
  const router = useRouter();
  const { session } = useAuth();

  const [latin, setLatin] = useState("");
  const [english, setEnglish] = useState("");
  const [serto, setSerto] = useState("");
  const [dutch, setDutch] = useState("");
  const [pos, setPos] = useState("noun");
  const [dialect, setDialect] = useState("");
  const [example, setExample] = useState("");
  const [audio, setAudio] = useState(false);
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = latin.trim() && english.trim();

  const notify = (text: string) => {
    setError(text);
    if (Platform.OS !== "web") Alert.alert(text);
  };

  if (!session) {
    return (
      <View style={styles.center}>
        <Text style={styles.gate}>Log in to contribute a word.</Text>
        <Pressable style={styles.primary} onPress={() => router.push("/login")}>
          <Text style={styles.primaryText}>Log in</Text>
        </Pressable>
      </View>
    );
  }

  if (submitted) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={[styles.inner, { paddingTop: 40 }]}>
        <View style={styles.success}>
          <View style={styles.seal}>
            <Icon name="check" size={38} stroke={2.4} color={colors.verified} />
          </View>
          <Text style={styles.succSyr}>ܬܘܕܝ</Text>
          <Text style={styles.succTitle}>Tawdi — thank you.</Text>
          <Text style={styles.succText}>
            <Text style={styles.bold}>{latin || "Your word"}</Text> has been submitted and is now <Text style={styles.italic}>pending review</Text>. A steward will verify it, and you'll see it appear in the lexicon with your name credited.
          </Text>
          <View style={styles.succActions}>
            <Pressable style={styles.primary} onPress={() => { setSubmitted(false); setLatin(""); setEnglish(""); setSerto(""); setDutch(""); setExample(""); setAudio(false); }}>
              <Icon name="plus" size={16} color={colors.paper2} />
              <Text style={styles.primaryText}>Add another word</Text>
            </Pressable>
            <Pressable style={styles.ghost} onPress={() => router.push("/")}>
              <Text style={styles.ghostText}>Browse the lexicon</Text>
            </Pressable>
          </View>
          <View style={{ paddingTop: 14 }}>
            <Ornament width={56} />
          </View>
        </View>
      </ScrollView>
    );
  }

  const submit = async () => {
    if (!valid) return notify("Latin spelling and English meaning are required.");
    setBusy(true);
    setError(null);
    const { data, error } = await supabase
      .from("entries")
      .insert({
        primary_latin: latin.trim(),
        english: english.trim(),
        serto: serto.trim() || null,
        dutch: dutch.trim() || null,
        category: pos,
        dialect_tag: dialect.trim() || null,
        status: "pending",
        submitter_id: session.user.id,
      })
      .select("id")
      .single();
    if (!error && data && example.trim()) {
      await supabase.from("example_sentences").insert({
        entry_id: data.id,
        latin: example.trim(),
        submitter_id: session.user.id,
      });
    }
    setBusy(false);
    if (error) return notify(error.message);
    setSubmitted(true);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.inner}>
      <Pressable style={styles.crumb} onPress={() => router.push("/")}>
        <Icon name="chevronLeft" size={15} color={colors.ink3} />
        <Text style={styles.crumbText}>Home</Text>
      </Pressable>

      <View>
        <Text style={styles.rubric}>CONTRIBUTE</Text>
        <Text style={styles.h1}>Add a word  <Text style={styles.h1Syr}>ܡܠܬܐ</Text></Text>
        <Text style={styles.lede}>
          Only two things are required — the word in Latin letters and what it means in English. Everything else helps, but add only what you know. Don't worry about getting the spelling perfect; a steward will help.
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.fieldRow}>
          <View style={styles.col}>
            <Field label="Latin transliteration" required placeholder="e.g. shlomo" value={latin} onChangeText={setLatin} autoCapitalize="none" hint="How you'd write it with Latin letters." />
          </View>
          <View style={styles.col}>
            <Field label="English meaning" required placeholder="e.g. hello; peace" value={english} onChangeText={setEnglish} hint="A short gloss. Separate senses with a semicolon." />
          </View>
        </View>

        <View style={styles.fieldRow}>
          <View style={styles.col}>
            <Field label="Serto script" optional syr placeholder="ܫܠܡܐ" value={serto} onChangeText={setSerto} hint="Leave blank and a steward will add it." />
          </View>
          <View style={styles.col}>
            <Field label="Dutch meaning" optional placeholder="bv. hallo; vrede" value={dutch} onChangeText={setDutch} hint="Many speakers live in the Netherlands." />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Part of speech <Text style={styles.opt}>optional</Text></Text>
          <View style={styles.seg}>
            {POS.map((p, i) => (
              <Pressable key={p} onPress={() => setPos(p)} style={[styles.segBtn, i < POS.length - 1 && styles.segDivider, pos === p && styles.segOn]}>
                <Text style={[styles.segText, pos === p && styles.segOnText]}>{p}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Field label="Dialect" optional placeholder="e.g. General, Midyat" value={dialect} onChangeText={setDialect} hint={`The village or city whose pronunciation this follows. Homeland: ${REGIONS.turabdin.name}.`} />

        <Field label="Example sentence" optional placeholder="Shlomo, aydarbo hat? — Hello, how are you?" value={example} onChangeText={setExample} multiline style={styles.textarea} hint="A short phrase showing the word in use." />

        <View style={styles.field}>
          <Text style={styles.label}>Audio <Text style={styles.opt}>optional</Text></Text>
          <Pressable style={[styles.dropzone, audio && styles.dropzoneOn]} onPress={() => setAudio(!audio)}>
            <Icon name={audio ? "check" : "mic"} size={26} color={audio ? colors.verified : colors.ink3} />
            {audio ? (
              <Text style={styles.dzText}>shlomo-voice.m4a · 0:02 — tap to remove</Text>
            ) : (
              <Text style={styles.dzText}>Record or drop an audio file{"\n"}<Text style={styles.dzHint}>Hearing a word is how it survives. A two-second clip is plenty.</Text></Text>
            )}
          </Pressable>
        </View>

        {!!error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.foot}>
          <Text style={styles.footNote}>Submitted words enter the queue as Pending until a steward verifies them.</Text>
          <Pressable style={[styles.primary, (!valid || busy) && styles.disabled]} onPress={submit} disabled={!valid || busy}>
            <Text style={styles.primaryText}>{busy ? "Submitting…" : "Submit for review"}</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  inner: { width: "100%", maxWidth: maxContentWidth, alignSelf: "center", paddingHorizontal: 18, paddingTop: 16, paddingBottom: 48, gap: 24 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.lg, gap: spacing.md, backgroundColor: colors.paper },
  gate: { fontSize: 16, color: colors.ink2, textAlign: "center", fontFamily: fonts.body },

  crumb: { flexDirection: "row", alignItems: "center", gap: 7, alignSelf: "flex-start" },
  crumbText: { fontSize: 13.5, color: colors.ink3, fontFamily: fonts.body },

  rubric: { fontFamily: fonts.bodySemi, fontSize: 11, letterSpacing: 1.8, color: colors.ink3, marginBottom: 8 },
  h1: { fontFamily: fonts.head, fontSize: 32, color: colors.ink, marginBottom: 10 },
  h1Syr: { fontFamily: fonts.syr, fontSize: 30, color: colors.accent, writingDirection: "rtl" },
  lede: { color: colors.ink2, fontSize: 15.5, fontFamily: fonts.body, lineHeight: 23 },

  form: { gap: 22 },
  fieldRow: { flexDirection: "row", gap: 18, flexWrap: "wrap" },
  col: { flexGrow: 1, flexBasis: 220 },
  field: { gap: 7 },
  label: { fontSize: 14, color: colors.ink, fontFamily: fonts.bodySemi },
  opt: { color: colors.ink3, fontSize: 12, fontFamily: fonts.headItalic },
  textarea: { minHeight: 70, textAlignVertical: "top" },

  seg: { flexDirection: "row", flexWrap: "wrap", borderWidth: 1, borderColor: colors.rule2, borderRadius: radius.md, overflow: "hidden", alignSelf: "flex-start" },
  segBtn: { backgroundColor: colors.paper2, paddingVertical: 9, paddingHorizontal: 14 },
  segDivider: { borderRightWidth: 1, borderRightColor: colors.rule },
  segOn: { backgroundColor: colors.accent },
  segText: { fontSize: 14, color: colors.ink2, fontFamily: fonts.bodyMed },
  segOnText: { color: colors.paper2, fontFamily: fonts.bodySemi },

  dropzone: { borderWidth: 1.5, borderColor: colors.rule3, borderStyle: "dashed", borderRadius: radius.md, padding: 26, alignItems: "center", gap: 8, backgroundColor: colors.paper2 },
  dropzoneOn: { borderStyle: "solid", borderColor: colors.verified, backgroundColor: colors.verifiedTint },
  dzText: { color: colors.ink2, fontFamily: fonts.body, textAlign: "center", fontSize: 14 },
  dzHint: { color: colors.ink3, fontSize: 13 },

  error: { color: colors.accent, fontFamily: fonts.body },
  foot: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 16, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.rule, flexWrap: "wrap" },
  footNote: { color: colors.ink2, fontSize: 13.5, fontFamily: fonts.body, flex: 1, minWidth: 180 },

  primary: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: colors.accent, borderRadius: radius.md, paddingVertical: 12, paddingHorizontal: 18 },
  primaryText: { color: colors.paper2, fontFamily: fonts.bodySemi, fontSize: 15 },
  disabled: { opacity: 0.5 },
  ghost: { borderWidth: 1, borderColor: colors.rule2, borderRadius: radius.md, paddingVertical: 12, paddingHorizontal: 18 },
  ghostText: { color: colors.ink, fontFamily: fonts.bodySemi, fontSize: 15 },

  success: { alignItems: "center", gap: 18, paddingHorizontal: 10 },
  seal: { width: 76, height: 76, borderRadius: 38, backgroundColor: colors.verifiedTint, alignItems: "center", justifyContent: "center" },
  succSyr: { fontFamily: fonts.syr, fontSize: 30, color: colors.accent, writingDirection: "rtl" },
  succTitle: { fontFamily: fonts.head, fontSize: 28, color: colors.ink },
  succText: { color: colors.ink2, fontSize: 15.5, textAlign: "center", maxWidth: 380, fontFamily: fonts.body, lineHeight: 23 },
  succActions: { flexDirection: "row", gap: 12, flexWrap: "wrap", justifyContent: "center" },
  bold: { color: colors.ink, fontFamily: fonts.bodySemi },
  italic: { fontFamily: fonts.headItalic, color: colors.ink },
});
