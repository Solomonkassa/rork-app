import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, StatusBar } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { colors } from "@/constants/colors";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="(auth)/login" 
          options={{ 
            headerShown: false,
            presentation: 'modal',
          }} 
        />
        <Stack.Screen 
          name="(auth)/register" 
          options={{ 
            headerShown: false,
            presentation: 'modal',
          }} 
        />
        <Stack.Screen 
          name="game/[id]" 
          options={{ 
            title: "Game",
            headerBackTitle: "Back",
          }} 
        />
      </Stack>
    </ErrorBoundary>
  );
}