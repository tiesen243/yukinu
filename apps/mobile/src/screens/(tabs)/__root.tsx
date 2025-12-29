import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {
  HomeIcon,
  UsersIcon,
  UserIcon,
  SettingsIcon,
} from 'lucide-react-native'

import { IndexScreen } from '@/screens/(tabs)/_index'
import { AboutScreen } from '@/screens/(tabs)/about'
import { ProfileScreen } from '@/screens/(tabs)/profile'
import { SettingsScreen } from '@/screens/(tabs)/settings'

export const Tabs = createBottomTabNavigator({
  initialRouteName: 'index',
  screenOptions: {
    tabBarActiveTintColor: '#3f5ec2',
  },
  screens: {
    index: {
      screen: IndexScreen,
      options: {
        title: 'Home',
        tabBarIcon: (props) => <HomeIcon {...props} />,
      },
    },
    about: {
      screen: AboutScreen,
      options: {
        title: 'About',
        tabBarIcon: (props) => <UsersIcon {...props} />,
      },
    },
    profile: {
      screen: ProfileScreen,
      options: {
        title: 'Profile',
        tabBarIcon: (props) => <UserIcon {...props} />,
      },
    },
    settings: {
      screen: SettingsScreen,
      options: {
        title: 'Settings',
        tabBarIcon: (props) => <SettingsIcon {...props} />,
      },
    },
  },
})
