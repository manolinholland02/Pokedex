import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { ErrorBoundary } from '@/components/error-boundary';

void SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    'CabinetGrotesk-Black': require('../assets/fonts/CabinetGrotesk-Black.otf'),
    'CabinetGrotesk-Bold': require('../assets/fonts/CabinetGrotesk-Bold.otf'),
    'CabinetGrotesk-Extrabold': require('../assets/fonts/CabinetGrotesk-Extrabold.otf'),
    'CabinetGrotesk-Extralight': require('../assets/fonts/CabinetGrotesk-Extralight.otf'),
    'CabinetGrotesk-Light': require('../assets/fonts/CabinetGrotesk-Light.otf'),
    'CabinetGrotesk-Medium': require('../assets/fonts/CabinetGrotesk-Medium.otf'),
    'CabinetGrotesk-Regular': require('../assets/fonts/CabinetGrotesk-Regular.otf'),
    'CabinetGrotesk-Thin': require('../assets/fonts/CabinetGrotesk-Thin.otf'),
    'Rubik-Black': require('../assets/fonts/Rubik-Black.ttf'),
    'Rubik-BlackItalic': require('../assets/fonts/Rubik-BlackItalic.ttf'),
    'Rubik-Bold': require('../assets/fonts/Rubik-Bold.ttf'),
    'Rubik-BoldItalic': require('../assets/fonts/Rubik-BoldItalic.ttf'),
    'Rubik-ExtraBold': require('../assets/fonts/Rubik-ExtraBold.ttf'),
    'Rubik-ExtraBoldItalic': require('../assets/fonts/Rubik-ExtraBoldItalic.ttf'),
    'Rubik-Italic': require('../assets/fonts/Rubik-Italic.ttf'),
    'Rubik-Light': require('../assets/fonts/Rubik-Light.ttf'),
    'Rubik-LightItalic': require('../assets/fonts/Rubik-LightItalic.ttf'),
    'Rubik-Medium': require('../assets/fonts/Rubik-Medium.ttf'),
    'Rubik-MediumItalic': require('../assets/fonts/Rubik-MediumItalic.ttf'),
    'Rubik-Regular': require('../assets/fonts/Rubik-Regular.ttf'),
    'Rubik-RegularItalic': require('../assets/fonts/Rubik-RegularItalic.ttf'),
    'Rubik-SemiBold': require('../assets/fonts/Rubik-SemiBold.ttf'),
    'Rubik-SemiBoldItalic': require('../assets/fonts/Rubik-SemiBoldItalic.ttf'),
    'Inter-Regular': require('../assets/fonts/Inter-Regular.otf'),
    'SFProText-Regular': require('../assets/fonts/SFPRODISPLAYREGULAR.otf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
