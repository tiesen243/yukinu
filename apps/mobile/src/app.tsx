import '@/globals.css'

import { DefaultTheme } from '@react-navigation/native'
import { QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useUniwind } from 'uniwind'

import { queryClient } from '@/lib/trpc'
import { Navigation } from '@/screens/__root'

SplashScreen.preventAutoHideAsync()

export default function App() {
  const { theme: colorscheme } = useUniwind()
  const theme =
    colorscheme === 'dark'
      ? {
          ...DefaultTheme,
          colors: {
            background: 'rgb(0, 0, 0)',
            text: 'rgb(255, 255, 255)',
            card: 'rgb(10, 10, 10)',
            primary: 'rgb(63, 94, 194)',
            border: 'rgb(36, 36, 36)',
            notification: 'rgb(10, 10, 10)',
          },
        }
      : {
          ...DefaultTheme,
          colors: {
            background: 'rgb(250, 250, 250)',
            text: 'rgb(0, 0, 0)',
            card: 'rgb(255, 255, 255)',
            primary: 'rgb(63, 94, 194)',
            border: ' rgb(228, 228, 228)',
            notification: 'rgb(255, 255, 255)',
          },
        }

  useFonts({
    GeistRegular: require('../assets/fonts/Geist-Regular.ttf'),
    GeistMedium: require('../assets/fonts/Geist-Medium.ttf'),
    GeistSemiBold: require('../assets/fonts/Geist-SemiBold.ttf'),
    GeistBold: require('../assets/fonts/Geist-Bold.ttf'),
    GeistExtraBold: require('../assets/fonts/Geist-ExtraBold.ttf'),

    GeistMonoMedium: require('../assets/fonts/GeistMono-Medium.ttf'),
  })

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <Navigation theme={theme} onReady={() => SplashScreen.hideAsync()} />
      </QueryClientProvider>

      <StatusBar
        barStyle={colorscheme === 'dark' ? 'light-content' : 'dark-content'}
      />
    </SafeAreaProvider>
  )
}
