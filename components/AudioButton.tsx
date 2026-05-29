import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Svg, { Path, Polygon } from "react-native-svg";
import { colors, fonts, radius } from "@/lib/theme";

// Simulated audio play button (real playback wires to audio_recordings later).
export function AudioButton({ label = "Hear it" }: { label?: string }) {
  const [playing, setPlaying] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function toggle() {
    if (playing) {
      if (timer.current) clearTimeout(timer.current);
      setPlaying(false);
      return;
    }
    setPlaying(true);
    timer.current = setTimeout(() => setPlaying(false), 1400);
  }

  return (
    <Pressable style={styles.btn} onPress={toggle}>
      <View style={styles.ring}>
        <Svg width={13} height={13} viewBox="0 0 24 24">
          {playing ? (
            <Polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill={colors.paper2} />
          ) : (
            <Polygon points="7 5 19 12 7 19 7 5" fill={colors.paper2} />
          )}
        </Svg>
      </View>
      <Text style={styles.label}>{playing ? "Playing…" : label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    backgroundColor: colors.accentTint,
    borderWidth: 1,
    borderColor: colors.accentTint2,
    borderRadius: radius.capsule,
    paddingVertical: 8,
    paddingLeft: 11,
    paddingRight: 15,
    alignSelf: "flex-start",
  },
  ring: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.accent, alignItems: "center", justifyContent: "center" },
  label: { fontSize: 14, color: colors.accentStrong, fontFamily: fonts.bodySemi },
});
