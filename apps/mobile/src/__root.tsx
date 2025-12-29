import type { StaticParamList } from '@react-navigation/native'

import { createStaticNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { Tabs } from '@/screens/(tabs)/__root'
import { LoginScreen } from '@/screens/login'
import { NotFoundScreen } from '@/screens/not-found'
import { ReduxScreen } from '@/screens/redux'

const RootStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
  },
  screens: {
    tabs: Tabs,
    login: {
      screen: LoginScreen,
      options: { title: 'Login' },
    },
    redux: {
      screen: ReduxScreen,
      options: { title: 'Redux' },
    },
    notFound: {
      screen: NotFoundScreen,
      options: { title: 'Not Found' },
      linking: { path: '' },
    },
  },
})

export const Navigation = createStaticNavigation(RootStack)

type RootStackParamList = StaticParamList<typeof RootStack>

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
