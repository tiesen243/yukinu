import '@/globals.css'

import {
  Geist_400Regular,
  Geist_500Medium,
  Geist_600SemiBold,
  Geist_700Bold,
} from '@expo-google-fonts/geist'
import { Assets as NavigationAssets } from '@react-navigation/elements'
import { DarkTheme, DefaultTheme } from '@react-navigation/native'
import { QueryClientProvider } from '@tanstack/react-query'
import { Asset } from 'expo-asset'
import { useFonts } from 'expo-font'
import { createURL } from 'expo-linking'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'
import { useUniwind } from 'uniwind'

import { Navigation } from '@/__root'
import { queryClient } from '@/lib/trpc'

SplashScreen.preventAutoHideAsync()

Asset.loadAsync([...NavigationAssets, require('../assets/icon.png')])

const prefix = createURL('/')

export function App() {
  const { theme: colorcheme } = useUniwind()
  const theme = colorcheme === 'dark' ? DarkTheme : DefaultTheme

  const [loaded, error] = useFonts({
    Geist_400Regular,
    Geist_500Medium,
    Geist_600SemiBold,
    Geist_700Bold,
  })

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync()
  }, [loaded, error])

  return (
    <QueryClientProvider client={queryClient}>
      <Navigation
        theme={theme}
        linking={{ enabled: 'auto', prefixes: [prefix] }}
        onReady={() => SplashScreen.hideAsync()}
      />
    </QueryClientProvider>
  )
}
