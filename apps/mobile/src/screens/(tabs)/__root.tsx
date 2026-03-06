import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { HomeIcon } from 'lucide-react-native'

import TabsIndexScreen from '@/screens/(tabs)/_index'

const Tabs = createBottomTabNavigator({
  initialRouteName: 'index',

  screenOptions: {
    tabBarShowLabel: false,
  },

  screens: {
    index: {
      screen: TabsIndexScreen,
      options: {
        title: 'Home',
        tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
      },
    },
  },
})

export default Tabs
