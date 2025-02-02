import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {/* Ensure header is hidden globally for these screens */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(authentication)" options={{ headerShown: false }} />
        <Stack.Screen name="(stackholders)" options={{ headerShown: false }} />
        
        {/* The (tabs) screen should also have its header hidden */}
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,  // Hide header for tabs
            cardStyle: { backgroundColor: 'white' },
          }}
        />
        
        <StatusBar style="light" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
