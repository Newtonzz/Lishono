// Shared visual tokens. Keeping these in one place makes the web build and the
// future native screens look consistent.

export const colors = {
  ink: "#1a1a2e",
  inkSoft: "#4a4a63",
  sand: "#f7f3ed",
  card: "#ffffff",
  clay: "#b5651d",
  accent: "#7c3aed",
  border: "#e4ddd2",
  green: "#2f855a",
  amber: "#b7791f",
  red: "#c53030",
  muted: "#8a8378",
};

export const statusColor: Record<string, string> = {
  verified: colors.green,
  pending: colors.amber,
  disputed: colors.red,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 40,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
};

export const maxContentWidth = 720;
