import type { ConfigContext, ExpoConfig } from 'expo/config'

import pkg from './package.json'

// "name": "@yukinu/mobile",
// name => Yukinu
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name:
    pkg.name.match(/^@([^/]+)/)?.[1]?.replace(/^./, (c) => c.toUpperCase()) ??
    pkg.name,
  slug: pkg.name.replaceAll('@', '').replaceAll('/', '-').trim(),
  version: pkg.version,
  orientation: 'portrait',
  scheme: pkg.name.replaceAll('@', '').split('/').at(0),
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  updates: { fallbackToCacheTimeout: 0 },
  newArchEnabled: true,
  assetBundlePatterns: ['**/*'],
  ios: {
    bundleIdentifier: `com.${pkg.name.replaceAll('@', '').replaceAll('/', '.')}`,
    supportsTablet: true,
    icon: './assets/icon.png',
  },
  android: {
    package: `com.${pkg.name.replaceAll('@', '').replaceAll('/', '.')}`,
    adaptiveIcon: {
      foregroundImage: './assets/icon.png',
      backgroundColor: '#14185a',
    },
    edgeToEdgeEnabled: true,
  },
  experiments: {
    tsconfigPaths: true,
  },
  plugins: [
    [
      'expo-font',
      {
        fonts: [
          'node_modules/@expo-google-fonts/geist/100Thin/Geist_100Thin.ttf',
          'node_modules/@expo-google-fonts/geist/200ExtraLight/Geist_200ExtraLight.ttf',
          'node_modules/@expo-google-fonts/geist/300Light/Geist_300Light.ttf',
          'node_modules/@expo-google-fonts/geist/400Regular/Geist_400Regular.ttf',
          'node_modules/@expo-google-fonts/geist/500Medium/Geist_500Medium.ttf',
          'node_modules/@expo-google-fonts/geist/600SemiBold/Geist_600SemiBold.ttf',
          'node_modules/@expo-google-fonts/geist/700Bold/Geist_700Bold.ttf',
          'node_modules/@expo-google-fonts/geist/800ExtraBold/Geist_800ExtraBold.ttf',
          'node_modules/@expo-google-fonts/geist/900Black/Geist_900Black.ttf',
        ],
      },
    ],
    [
      'expo-splash-screen',
      {
        backgroundColor: '#14185a',
        image: './assets/icon.png',
      },
    ],
  ],
})
