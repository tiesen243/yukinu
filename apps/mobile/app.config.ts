import { ExpoConfig, ConfigContext } from 'expo/config'

import pkg from './package.json'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name:
    pkg.name.match(/^@([^/]+)/)?.[1]?.replace(/^./, (c) => c.toUpperCase()) ??
    pkg.name,
  slug: pkg.name.replaceAll('@', '').replaceAll('/', '-').trim(),
  version: pkg.version,
  orientation: 'portrait',
  scheme: pkg.name.replaceAll('@', '').split('/').at(0),
  icon: './assets/icon-light.png',
  userInterfaceStyle: 'automatic',
  updates: { fallbackToCacheTimeout: 0 },
  newArchEnabled: true,
  assetBundlePatterns: ['**/*'],
  ios: {
    bundleIdentifier: `com.${pkg.name.replaceAll('@', '').replaceAll('/', '.')}`,
    associatedDomains: ['webcredentials:yukinu.vercel.app'],
    supportsTablet: true,
    icon: {
      light: './assets/icon-light.png',
      dark: './assets/icon-dark.png',
    },
  },
  android: {
    package: `com.${pkg.name.replaceAll('@', '').replaceAll('/', '.')}`,
    adaptiveIcon: {
      foregroundImage: './assets/icon-light.png',
      backgroundColor: '#14185a',
    },
    edgeToEdgeEnabled: true,
  },
  experiments: {
    tsconfigPaths: true,
    autolinkingModuleResolution: true,
  },
  plugins: [
    'expo-image-picker',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#ffffff',
        image: './assets/icon-light.png',
        dark: {
          backgroundColor: '#000000',
          image: './assets/icon-dark.png',
        },
      },
    ],
    [
      'expo-font',
      {
        fonts: [
          './assets/fonts/Geist-Regular.ttf',
          './assets/fonts/Geist-Medium.ttf',
          './assets/fonts/Geist-SemiBold.ttf',
          './assets/fonts/Geist-Bold.ttf',
          './assets/fonts/Geist-ExtraBold.ttf',

          './assets/fonts/GeistMono-Medium.ttf',
        ],
      },
    ],
  ],
})
