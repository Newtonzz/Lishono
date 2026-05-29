import { useCallback } from "react";
import { Link, Stack } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, Newsreader_400Regular, Newsreader_500Medium, Newsreader_600SemiBold, Newsreader_400Regular_Italic } from "@expo-google-fonts/newsreader";
import { PublicSans_400Regular, PublicSans_500Medium, PublicSans_600SemiBold, PublicSans_700Bold } from "@expo-google-fonts/public-sans";
import { NotoSansSyriac_400Regular, NotoSansSyriac_600SemiBold } from "@expo-google-fonts/noto-sans-syriac";
import { AuthProvider, useAuth } from "@/lib/auth";
import { colors, fonts } from "@/lib/theme";

SplashScreen.preventAutoHideAsync().catch(() => {});

function HeaderRight() {
  const { session, signOut } = useAuth();
  if (session) {
    return (
      <Pressable onPress={signOut} hitSlop={8}>
        <Text style={styles.navLink}>Sign out</Text>
      </Pressable>
    );
  }
  return (
    <Link href="/login" asChild>
      <Pressable hitSlop={8}>
        <Text style={styles.navLink}>Log in</Text>
      </Pressable>
    </Link>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    Newsreader_400Regular,
    Newsreader_500Medium,
    Newsreader_600SemiBold,
    Newsreader_400Regular_Italic,
    PublicSans_400Regular,
    PublicSans_500Medium,
    PublicSans_600SemiBold,
    PublicSans_700Bold,
    NotoSansSyriac_400Regular,
    NotoSansSyriac_600SemiBold,
  });

  const onReady = useCallback(() => {
    if (loaded) SplashScreen.hideAsync().catch(() => {});
  }, [loaded]);

  if (!loaded) return null;

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <View style={styles.root} onLayout={onReady}>
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: colors.paper },
              headerTintColor: colors.ink,
              headerShadowVisible: false,
              headerTitleStyle: { fontFamily: fonts.head, fontSize: 19, color: colors.ink },
              headerTitleAlign: "center",
              contentStyle: { backgroundColor: colors.paper },
              headerRight: () => <HeaderRight />,
            }}
          >
            <Stack.Screen name="index" options={{ title: "Lishono · ܠܫܢܐ" }} />
            <Stack.Screen name="submit" options={{ title: "Contribute" }} />
            <Stack.Screen name="entry/[id]" options={{ title: "" }} />
            <Stack.Screen name="login" options={{ title: "Log in" }} />
            <Stack.Screen name="admin" options={{ title: "Review queue" }} />
          </Stack>
        </View>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.paper },
  navLink: { color: colors.accent, fontFamily: fonts.bodySemi, fontSize: 15 },
});
