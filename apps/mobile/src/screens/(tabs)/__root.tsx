import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useNavigation } from '@react-navigation/native'
import { HomeIcon, MenuIcon, SettingsIcon, UserIcon } from 'lucide-react-native'
import { lazy } from 'react'
import { Image } from 'react-native'
import { useUniwind } from 'uniwind'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import IndexScreen from '@/screens/(tabs)/_index'

const Tabs = createMaterialTopTabNavigator({
  initialRouteName: 'index',
  screenOptions: {
    tabBarIndicatorStyle: { backgroundColor: '#3f5ec2' },
    tabBarShowLabel: false,
    tabBarActiveTintColor: '#3f5ec2',
    tabBarInactiveTintColor: '#525252',
  },
  screens: {
    index: {
      screen: IndexScreen,
      options: {
        tabBarIcon: ({ color }) => <HomeIcon color={color} size={20} />,
      },
    },
    profile: {
      screen: lazy(() => import('@/screens/(tabs)/profile')),
      options: {
        tabBarIcon: ({ color }) => <UserIcon color={color} size={20} />,
      },
    },
    menu: {
      screen: lazy(() => import('@/screens/(tabs)/menu')),
      options: {
        tabBarIcon: ({ color }) => <MenuIcon color={color} size={20} />,
      },
    },
  },
})

function HeaderLeft() {
  return (
    <Image
      className='size-8 rounded-full object-cover'
      source={{
        uri: 'https://1.gravatar.com/avatar/48b8ec4ce6c85e06c11bda4381a3ac6cb8161a23e5ea540544c809063090815d?s=512&d=identicon',
      }}
    />
  )
}

function HeaderTitle() {
  const { theme } = useUniwind()

  return (
    <Image
      className='size-8 object-cover mx-auto'
      source={
        theme === 'dark'
          ? require('../../../assets/logo-dark.png')
          : require('../../../assets/logo-light.png')
      }
    />
  )
}

function HeaderRight() {
  const navigation = useNavigation()

  return (
    <Button
      variant='ghost'
      size='icon'
      onPress={() => navigation.navigate('settings')}
    >
      <Icon as={SettingsIcon} />
    </Button>
  )
}

export default Tabs
export { HeaderLeft, HeaderTitle, HeaderRight }
