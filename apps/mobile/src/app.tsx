import '@/globals.css'

import {
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
} from '@expo-google-fonts/geist'
import { DarkTheme, DefaultTheme } from '@react-navigation/native'
import { QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import { createURL } from 'expo-linking'
import * as SplashScreen from 'expo-splash-screen'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider as ReduxProvider } from 'react-redux'
import { useUniwind } from 'uniwind'

import { queryClient } from '@/lib/trpc'
import { Navigation } from '@/screens/__root'
import { store } from '@/store'

SplashScreen.preventAutoHideAsync()

const prefix = createURL('/')

export function App() {
  const { theme: colorcheme } = useUniwind()
  const theme = colorcheme === 'dark' ? DarkTheme : DefaultTheme

  useFonts({
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
  })

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <ReduxProvider store={store}>
          <Navigation
            theme={theme}
            linking={{ enabled: 'auto', prefixes: [prefix] }}
            onReady={() => SplashScreen.hideAsync()}
          />
        </ReduxProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  )
}
