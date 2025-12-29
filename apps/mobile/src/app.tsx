import '@/globals.css'

import { Assets as NavigationAssets } from '@react-navigation/elements'
import { DarkTheme, DefaultTheme } from '@react-navigation/native'
import { Asset } from 'expo-asset'
import { createURL } from 'expo-linking'
import * as SplashScreen from 'expo-splash-screen'
import { useUniwind } from 'uniwind'

import { Navigation } from '@/__root'

SplashScreen.preventAutoHideAsync()

Asset.loadAsync([...NavigationAssets, require('../assets/icon.png')])

const prefix = createURL('/')

export function App() {
  const { theme: colorcheme } = useUniwind()
  const theme = colorcheme === 'dark' ? DarkTheme : DefaultTheme

  return (
    <Navigation
      theme={theme}
      linking={{ enabled: 'auto', prefixes: [prefix] }}
      onReady={() => SplashScreen.hideAsync()}
    />
  )
}
