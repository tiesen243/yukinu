import type { StaticParamList } from '@react-navigation/native'

import { createStaticNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Tabs from '@/screens/(tabs)/__root'

const RootStack = createNativeStackNavigator({
  screens: {
    tabs: {
      screen: Tabs,
      options: { headerShown: false },
    },
  },
})

export default createStaticNavigation(RootStack)

type RootStackParamList = StaticParamList<typeof RootStack>

declare global {
  // oxlint-disable-next-line typescript/no-namespace
  namespace ReactNavigation {
    // oxlint-disable-next-line typescript/no-empty-interface, typescript/no-empty-object-type
    interface RootParamList extends RootStackParamList {}
  }
}
