import type { StaticParamList } from '@react-navigation/native'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStaticNavigation } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import {
  HomeIcon,
  SettingsIcon,
  UserIcon,
  UsersIcon,
} from 'lucide-react-native'

import { IndexScreen } from '@/screens'
import { AboutScreen } from '@/screens/about'
import { LoginScreen } from '@/screens/login'
import { NotFoundScreen } from '@/screens/not-found'
import { ProfileScreen } from '@/screens/profile'
import { SettingsScreen } from '@/screens/settings'

const BottomTabs = createBottomTabNavigator({
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

const RootStack = createNativeStackNavigator({
  screenOptions: {
    headerShown: false,
    gestureEnabled: true,
  },
  screens: {
    main: BottomTabs,
    login: {
      screen: LoginScreen,
      options: { title: 'Login' },
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
