import type { StaticParamList } from '@react-navigation/native'

import { createStaticNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { IndexScreen } from '@/screens'
import { AboutScreen } from '@/screens/about'
import { NotFoundScreen } from '@/screens/not-found'

const RootStack = createNativeStackNavigator({
  screens: {
    index: {
      screen: IndexScreen,
      options: { title: 'Home' },
    },
    about: {
      screen: AboutScreen,
      options: { title: 'About' },
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
