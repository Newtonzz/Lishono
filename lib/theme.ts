// Lishono — manuscript / stewardship design tokens, ported from the
// Claude Design prototype (parchment ground, oxblood ink, Serto script).
// Web-only effects from the prototype (paper grain, backdrop blur, fluid
// clamp() type, CSS grid auto-fit) are approximated for React Native.

export const colors = {
  // Parchment grounds
  paper: "#f2eadb",
  paper2: "#f8f1e4",
  paper3: "#ebe1cf",
  paperEdge: "#e4d8c1",

  // Ink (warm, never pure black)
  ink: "#2a2319",
  ink2: "#6a604f",
  ink3: "#978b76",
  ink4: "#b3a890",

  // Hairlines / rules
  rule: "rgba(42,35,25,0.12)",
  rule2: "rgba(42,35,25,0.24)",
  rule3: "rgba(42,35,25,0.40)",

  // Single rich accent — oxblood
  accent: "#7c2d2a",
  accentStrong: "#66231f",
  accentTint: "rgba(124,45,42,0.10)",
  accentTint2: "rgba(124,45,42,0.16)",

  // Manuscript rubric gold — ornaments + roles only
  gold: "#a87d27",
  goldTint: "rgba(168,125,39,0.16)",

  // Status (earthy, semantic only)
  verified: "#5f6a37",
  verifiedTint: "rgba(95,106,55,0.15)",
  pending: "#b07d1f",
  pendingTint: "rgba(176,125,31,0.16)",
};

// Font family names as registered by @expo-google-fonts via useFonts().
export const fonts = {
  head: "Newsreader_500Medium",
  headReg: "Newsreader_400Regular",
  headSemi: "Newsreader_600SemiBold",
  headItalic: "Newsreader_400Regular_Italic",
  body: "PublicSans_400Regular",
  bodyMed: "PublicSans_500Medium",
  bodySemi: "PublicSans_600SemiBold",
  bodyBold: "PublicSans_700Bold",
  syr: "NotoSansSyriac_400Regular",
  syrSemi: "NotoSansSyriac_600SemiBold",
};

// Restrained radii — mostly squared (no rounded-everything)
export const radius = {
  xs: 2,
  sm: 3,
  md: 5,
  lg: 8,
  capsule: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
};

export const statusColor: Record<string, string> = {
  verified: colors.verified,
  pending: colors.pending,
  disputed: colors.accent,
};

// Manuscript content measure
export const maxContentWidth = 760;
