import type { StaticParamList } from '@react-navigation/native'

import { createStaticNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { lazy } from 'react'

import Tabs, {
  HeaderLeft,
  HeaderRight,
  HeaderTitle,
} from '@/screens/(tabs)/__root'

const RootStack = createNativeStackNavigator({
  initialRouteName: 'tabs',
  screenOptions: {
    headerShown: true,
  },
  screens: {
    tabs: {
      screen: Tabs,
      options: {
        headerTitle: HeaderTitle,
        headerLeft: HeaderLeft,
        headerRight: HeaderRight,
        headerShadowVisible: false,
      },
    },
    notFound: {
      screen: lazy(() => import('@/screens/not-found')),
      options: { title: 'Oops!' },
    },
  },
})

export const Navigation = createStaticNavigation(RootStack)

declare global {
  type RootStackParamList = StaticParamList<typeof RootStack>

  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
