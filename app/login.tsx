import { useState } from "react";
import { Alert, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { colors, fonts, radius, spacing } from "@/lib/theme";
import { Field } from "@/components/Field";
import { Ornament } from "@/components/Ornament";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const notify = (text: string) => {
    setMessage(text);
    if (Platform.OS !== "web") Alert.alert(text);
  };

  const redirectTo = () => {
    if (Platform.OS === "web" && typeof window !== "undefined") return window.location.origin;
    return "lishono://";
  };

  const sendMagicLink = async () => {
    if (!email.trim()) return notify("Enter your email first.");
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: redirectTo() } });
    setBusy(false);
    if (error) return notify(error.message);
    setSent(true);
    notify("Check your inbox for a magic link.");
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: redirectTo() } });
    if (error) notify(error.message);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.inner}>
        <View style={styles.ornament}><Ornament width={64} /></View>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.sub}>Logging in lets you submit entries, vote, and add notes. Browsing stays open to everyone.</Text>

        <Pressable style={styles.google} onPress={signInWithGoogle}>
          <Text style={styles.googleText}>Continue with Google</Text>
        </Pressable>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.or}>or</Text>
          <View style={styles.line} />
        </View>

        <Field label="Email" placeholder="you@example.com" value={email} onChangeText={setEmail} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" />
        <Pressable style={[styles.primary, busy && styles.disabled]} onPress={sendMagicLink} disabled={busy}>
          <Text style={styles.primaryText}>{sent ? "Resend magic link" : "Email me a magic link"}</Text>
        </Pressable>

        {!!message && <Text style={styles.message}>{message}</Text>}

        <Pressable onPress={() => router.replace("/")} style={{ marginTop: spacing.lg }}>
          <Text style={styles.back}>← Back to the lexicon</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  inner: { width: "100%", maxWidth: 420, alignSelf: "center", padding: spacing.lg, marginTop: spacing.xl, gap: 4 },
  ornament: { marginBottom: spacing.lg },
  title: { fontFamily: fonts.head, fontSize: 28, color: colors.ink },
  sub: { fontSize: 14.5, color: colors.ink2, marginTop: 6, marginBottom: spacing.lg, lineHeight: 21, fontFamily: fonts.body },
  google: { borderWidth: 1, borderColor: colors.rule2, backgroundColor: colors.paper2, borderRadius: radius.md, paddingVertical: 12, alignItems: "center" },
  googleText: { fontFamily: fonts.bodySemi, color: colors.ink, fontSize: 15 },
  divider: { flexDirection: "row", alignItems: "center", marginVertical: spacing.lg, gap: spacing.sm },
  line: { flex: 1, height: 1, backgroundColor: colors.rule },
  or: { color: colors.ink3, fontSize: 13, fontFamily: fonts.body },
  primary: { backgroundColor: colors.accent, borderRadius: radius.md, paddingVertical: 12, alignItems: "center", marginTop: 14 },
  primaryText: { color: colors.paper2, fontFamily: fonts.bodySemi, fontSize: 15 },
  disabled: { opacity: 0.6 },
  message: { marginTop: spacing.md, color: colors.verified, fontSize: 13, fontFamily: fonts.body },
  back: { color: colors.accent, fontFamily: fonts.bodySemi },
});
