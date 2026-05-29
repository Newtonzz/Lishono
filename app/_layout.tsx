import { Link, Stack } from "expo-router";
import { Pressable, Text, StyleSheet } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "@/lib/auth";
import { colors } from "@/lib/theme";

function HeaderRight() {
  const { session, signOut } = useAuth();
  if (session) {
    return (
      <Pressable onPress={signOut} hitSlop={8}>
        <Text style={styles.headerLink}>Sign out</Text>
      </Pressable>
    );
  }
  return (
    <Link href="/login" asChild>
      <Pressable hitSlop={8}>
        <Text style={styles.headerLink}>Log in</Text>
      </Pressable>
    </Link>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.sand },
            headerTintColor: colors.ink,
            headerTitleStyle: { fontWeight: "700" },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: colors.sand },
            headerRight: () => <HeaderRight />,
          }}
        >
          <Stack.Screen name="index" options={{ title: "Lishono ܠܫܢܐ" }} />
          <Stack.Screen name="submit" options={{ title: "Submit an entry" }} />
          <Stack.Screen name="entry/[id]" options={{ title: "Entry" }} />
          <Stack.Screen name="login" options={{ title: "Log in" }} />
          <Stack.Screen name="admin" options={{ title: "Review queue" }} />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  headerLink: { color: colors.accent, fontWeight: "600", fontSize: 15 },
});
