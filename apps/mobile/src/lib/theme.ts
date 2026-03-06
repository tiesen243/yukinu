import type { Theme } from '@react-navigation/native'

import { DefaultTheme } from '@react-navigation/native'

export const LightTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    background: 'rgb(250, 250, 250)',
    text: 'rgb(0, 0, 0)',
    card: 'rgb(255, 255, 255)',
    notification: 'rgb(255, 255, 255)',
    primary: 'rgb(63, 94, 194)',
    border: 'rgb(228, 228, 228)',
  },
} satisfies Theme

export const DarkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    background: 'rgb(0, 0, 0)',
    text: 'rgb(255, 255, 255)',
    card: 'rgb(10, 10, 10)',
    notification: 'rgb(10, 10, 10)',
    primary: 'rgb(63, 94, 194)',
    border: 'rgb(36,, 36, 36)',
  },
} satisfies Theme
