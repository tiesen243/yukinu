import '@/globals.css'

import { DarkTheme, DefaultTheme } from '@react-navigation/native'
import * as SplashScreen from 'expo-splash-screen'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useUniwind } from 'uniwind'

import { Navigation } from '@/screens/__root'

SplashScreen.preventAutoHideAsync()

export default function App() {
  const { theme: colorscheme } = useUniwind()
  const theme = colorscheme === 'dark' ? DarkTheme : DefaultTheme

  return (
    <SafeAreaProvider>
      <Navigation theme={theme} onReady={() => SplashScreen.hideAsync()} />
    </SafeAreaProvider>
  )
}
