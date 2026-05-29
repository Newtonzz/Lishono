import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { colors, fonts } from "@/lib/theme";
import { Wordmark } from "./Wordmark";
import { Ornament } from "./Ornament";
import { Icon } from "./Icon";

const REPO = "https://github.com/Newtonzz/Lishono";

// Manuscript colophon footer: four-star ornament, wordmark, mission, license,
// nav links, and a contributor meta line. Ported from the design's app shell.
export function Footer({ words = 1264, contributors = 37, stewards = 2 }: { words?: number; contributors?: number; stewards?: number }) {
  const router = useRouter();
  return (
    <View style={styles.footer}>
      <View style={styles.ornament}>
        <Ornament width={66} />
      </View>
      <View style={styles.cols}>
        <View style={styles.left}>
          <Wordmark />
          <Text style={styles.meta}>
            A community-built lexicon for spoken Suryoyo (Turoyo), an endangered Aramaic language of Tur Abdin. Built and kept by its diaspora.
          </Text>
          <Text style={styles.license}>
            Text under <Text style={styles.link}>CC BY-SA 4.0</Text> · audio CC BY
          </Text>
        </View>
        <View style={styles.colophon}>
          <View style={styles.links}>
            <Pressable onPress={() => router.push("/")}><Text style={styles.linkBtn}>About</Text></Pressable>
            <Pressable onPress={() => router.push("/")}><Text style={styles.linkBtn}>Browse</Text></Pressable>
            <Pressable onPress={() => router.push("/submit")}><Text style={styles.linkBtn}>Contribute</Text></Pressable>
            <Pressable onPress={() => Linking.openURL(REPO)} style={styles.ghLink}>
              <Icon name="github" size={15} color={colors.ink2} />
              <Text style={styles.linkBtn}>GitHub</Text>
            </Pressable>
          </View>
          <Text style={styles.metaRight}>
            {words.toLocaleString()} words · {contributors} contributors · {stewards} stewards
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: { borderTopWidth: 1, borderTopColor: colors.rule, marginTop: 56, paddingTop: 32, paddingBottom: 12 },
  ornament: { marginBottom: 26 },
  cols: { flexDirection: "row", justifyContent: "space-between", gap: 24, flexWrap: "wrap" },
  left: { flexShrink: 1, gap: 12, minWidth: 240 },
  meta: { fontSize: 13, color: colors.ink3, fontFamily: fonts.body, maxWidth: 320, lineHeight: 19 },
  license: { fontSize: 12.5, color: colors.ink3, fontFamily: fonts.body },
  link: { color: colors.accent, fontFamily: fonts.bodyMed },
  colophon: { alignItems: "flex-end", gap: 8 },
  links: { flexDirection: "row", gap: 22, flexWrap: "wrap", justifyContent: "flex-end" },
  ghLink: { flexDirection: "row", alignItems: "center", gap: 6 },
  linkBtn: { fontSize: 14, color: colors.ink2, fontFamily: fonts.body },
  metaRight: { fontSize: 13, color: colors.ink3, fontFamily: fonts.body, textAlign: "right" },
});
