import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { colors, fonts, maxContentWidth, radius, spacing } from "@/lib/theme";
import type { Entry } from "@/lib/types";
import { REGIONS, REGION_ORDER } from "@/lib/regions";
import { Emblem, HomelandMap } from "@/components/Emblem";
import { Icon } from "@/components/Icon";
import { SectionHead } from "@/components/SectionHead";
import { EntryCard } from "@/components/EntryCard";
import { Footer } from "@/components/Footer";

const EXAMPLES = ["shlomo", "bayto", "emo", "babo", "tawdi"];

export default function HomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const mapW = Math.min(width - 88, maxContentWidth - 36);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("entries")
      .select("*")
      .order("status", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(100);
    setEntries(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries.slice(0, 6);
    return entries.filter(
      (e) =>
        e.primary_latin.toLowerCase().includes(q) ||
        e.english.toLowerCase().includes(q) ||
        (e.serto ?? "").includes(q)
    );
  }, [query, entries]);

  const searching = query.trim().length > 0;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.inner}>
      {/* Hero */}
      <View style={styles.hero}>
        <Emblem size={132} color={colors.accent} />
        <Text style={styles.mission}>A community lexicon for spoken Suryoyo.</Text>
        <Text style={styles.missionSub}>
          Turoyo · <Text style={styles.msSyr}>ܛܘܪܝܐ</Text> — a living, endangered Aramaic language of Tur Abdin, kept by its diaspora.
        </Text>

        <View style={styles.search}>
          <Icon name="search" size={22} color={colors.ink3} />
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Look up a word — try shlomo, bayto…"
            placeholderTextColor={colors.ink4}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.chips}>
          <Text style={styles.chipsLabel}>Try:</Text>
          {EXAMPLES.map((w) => (
            <Pressable key={w} style={styles.chip} onPress={() => setQuery(w)}>
              <Text style={styles.chipText}>{w}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Recently verified / results */}
      <View style={styles.section}>
        <SectionHead
          title={searching ? "Results" : "Recently verified"}
          syr={searching ? undefined : "ܡܫܪܪܐ"}
        />
        {loading ? (
          <ActivityIndicator color={colors.accent} style={{ marginVertical: spacing.lg }} />
        ) : filtered.length === 0 ? (
          <Text style={styles.empty}>
            {searching ? `No entries for “${query}”. ` : "No entries yet. "}
            <Link href="/submit" style={styles.linkInline}>Add the first word.</Link>
          </Text>
        ) : (
          <View>
            {filtered.map((e, i) => (
              <EntryCard key={e.id} entry={e} first={i === 0} />
            ))}
          </View>
        )}
      </View>

      {/* From the regions */}
      <View style={styles.section}>
        <SectionHead title="From the regions" syr="ܡܢ ܐܬܪܘܬܐ" />
        <Text style={styles.para}>
          Suryoyo travels with its speakers. Each variant is tagged to where it is heard today — from the villages of Tur Abdin to the diaspora.
        </Text>
        <View style={styles.regions}>
          {REGION_ORDER.map((id) => {
            const r = REGIONS[id];
            return (
              <View key={id} style={styles.region}>
                <View style={styles.rgTop}>
                  <Text style={styles.rgFlag}>{r.flag}</Text>
                  <Text style={styles.rgName}>{r.name}</Text>
                </View>
                <Text style={styles.rgSyr}>{r.syr}</Text>
                {!!r.note && <Text style={styles.rgNote}>{r.note}</Text>}
              </View>
            );
          })}
        </View>
      </View>

      {/* The homeland */}
      <View style={styles.section}>
        <SectionHead title="The homeland" syr="ܐܬܪܐ" />
        <Text style={styles.para}>
          Suryoyo grew up in <Text style={styles.bold}>Tur Abdin</Text> — the limestone plateau of upper Mesopotamia, <Text style={styles.italic}>Beth-Nahrin</Text>, “the land between the rivers.” Its monasteries, like <Text style={styles.bold}>Mor Gabriel</Text> (founded 397 AD), kept the Aramaic of the region alive for sixteen centuries. Today most of its speakers live in the diaspora.
        </Text>
        <View style={styles.mapCard}>
          <HomelandMap width={mapW} />
        </View>
        <View style={styles.photoRow}>
          {[
            { cap: "Mor Gabriel", ph: "Mor Gabriel monastery" },
            { cap: "Serto manuscript", ph: "A Serto manuscript page" },
            { cap: "Tur Abdin", ph: "The Tur Abdin plateau" },
          ].map((f) => (
            <View key={f.cap} style={styles.photo}>
              <View style={styles.photoSlot}>
                <Text style={styles.photoPh}>{f.ph}</Text>
              </View>
              <Text style={styles.photoCap}>{f.cap}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.photoNote}>Community photographs welcome — real images of the homeland can replace these frames.</Text>
      </View>

      {/* Contribute callout */}
      <View style={styles.callout}>
        <View style={styles.calloutBar} />
        <Text style={styles.rubric}>ADD TO THE LEXICON</Text>
        <Text style={styles.calloutTitle}>Know a word we're missing?</Text>
        <Text style={styles.para}>
          Every entry you add — a word from your grandmother, a phrase from your village — helps keep Suryoyo alive for the next generation.
        </Text>
        <Pressable style={styles.cta} onPress={() => router.push("/submit")}>
          <Icon name="quill" size={17} color={colors.paper2} />
          <Text style={styles.ctaText}>Contribute a word</Text>
        </Pressable>
      </View>

      <Footer />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.paper },
  inner: { width: "100%", maxWidth: maxContentWidth, alignSelf: "center", paddingHorizontal: 18, paddingTop: 28, paddingBottom: 48, gap: 40 },

  hero: { alignItems: "center" },
  mission: { fontFamily: fonts.headReg, fontSize: 25, color: colors.ink, textAlign: "center", marginTop: 18, lineHeight: 33 },
  missionSub: { color: colors.ink2, fontSize: 15.5, textAlign: "center", marginTop: 12, fontFamily: fonts.body, lineHeight: 22 },
  msSyr: { fontFamily: fonts.syr, color: colors.ink, writingDirection: "rtl" },

  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.paper2,
    borderWidth: 1,
    borderColor: colors.rule2,
    borderRadius: radius.md,
    paddingHorizontal: 18,
    marginTop: 30,
    width: "100%",
  },
  searchInput: { flex: 1, fontFamily: fonts.head, fontSize: 20, color: colors.ink, paddingVertical: 18 },

  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, alignItems: "center", justifyContent: "center", marginTop: 16 },
  chipsLabel: { fontSize: 13, color: colors.ink3, fontFamily: fonts.body },
  chip: { backgroundColor: colors.paper2, borderWidth: 1, borderColor: colors.rule, borderRadius: radius.sm, paddingHorizontal: 11, paddingVertical: 5 },
  chipText: { fontSize: 14, color: colors.ink, fontFamily: fonts.bodyMed },

  section: {},
  para: { color: colors.ink2, fontSize: 14.5, fontFamily: fonts.body, lineHeight: 22, marginTop: -6, marginBottom: 16 },
  bold: { color: colors.ink, fontFamily: fonts.bodySemi },
  italic: { fontFamily: fonts.headItalic, color: colors.ink },
  empty: { color: colors.ink3, fontFamily: fonts.body, paddingVertical: 8 },
  linkInline: { color: colors.accent, fontFamily: fonts.bodySemi },

  regions: { borderWidth: 1, borderColor: colors.rule, borderRadius: radius.md, overflow: "hidden", flexDirection: "row", flexWrap: "wrap" },
  region: { backgroundColor: colors.paper2, padding: 15, minHeight: 96, flexGrow: 1, flexBasis: 150, borderWidth: 0.5, borderColor: colors.rule },
  rgTop: { flexDirection: "row", alignItems: "center", gap: 8 },
  rgFlag: { fontSize: 15 },
  rgName: { fontFamily: fonts.head, fontSize: 16, color: colors.ink },
  rgSyr: { fontFamily: fonts.syr, fontSize: 14, color: colors.ink3, marginTop: 4, writingDirection: "rtl" },
  rgNote: { fontSize: 12.5, color: colors.ink3, marginTop: 6, fontFamily: fonts.body },

  mapCard: { backgroundColor: colors.paper2, borderWidth: 1, borderColor: colors.rule, borderRadius: radius.md, padding: 18, alignItems: "center" },
  photoRow: { flexDirection: "row", gap: 14, marginTop: 16, flexWrap: "wrap" },
  photo: { flexGrow: 1, flexBasis: 150 },
  photoSlot: { height: 110, borderWidth: 1, borderColor: colors.rule2, borderRadius: radius.md, backgroundColor: colors.paper3, alignItems: "center", justifyContent: "center", padding: 10 },
  photoPh: { color: colors.ink3, fontSize: 12.5, fontFamily: fonts.headItalic, textAlign: "center" },
  photoCap: { fontSize: 12.5, color: colors.ink3, marginTop: 7, fontFamily: fonts.headItalic },
  photoNote: { fontSize: 12.5, color: colors.ink3, marginTop: 10, textAlign: "center", fontFamily: fonts.body },

  callout: { borderWidth: 1, borderColor: colors.rule2, borderRadius: radius.md, padding: 26, backgroundColor: colors.paper2, position: "relative", gap: 8 },
  calloutBar: { position: "absolute", left: 0, top: 12, bottom: 12, width: 3, backgroundColor: colors.accent, borderRadius: 2 },
  rubric: { fontFamily: fonts.bodySemi, fontSize: 11, letterSpacing: 1.8, color: colors.ink3 },
  calloutTitle: { fontFamily: fonts.head, fontSize: 23, color: colors.ink },
  cta: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: colors.accent, borderRadius: radius.md, paddingVertical: 12, paddingHorizontal: 18, alignSelf: "flex-start", marginTop: 4 },
  ctaText: { color: colors.paper2, fontFamily: fonts.bodySemi, fontSize: 15 },
});
