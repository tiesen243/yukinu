import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import {
  HomeIcon,
  LogInIcon,
  SettingsIcon,
  ShoppingCartIcon,
  UserIcon,
} from 'lucide-react-native'
import { lazy } from 'react'
import { Image, View } from 'react-native'
import { useUniwind } from 'uniwind'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { trpc } from '@/lib/trpc'
import IndexScreen from '@/screens/(tabs)/_index'

const Tabs = createBottomTabNavigator({
  initialRouteName: 'index',
  screenOptions: {
    headerShown: false,
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
    cart: {
      screen: lazy(() => import('@/screens/(tabs)/cart')),
      options: {
        tabBarIcon: ({ color }) => <ShoppingCartIcon color={color} size={20} />,
      },
    },
  },
})

function HeaderLeft() {
  const { data, isLoading } = useQuery(trpc.auth.currentUser.queryOptions())
  const navigation = useNavigation()

  if (isLoading) return <View className='size-9 rounded-full bg-muted' />

  if (!data)
    return (
      <Button
        variant='ghost'
        size='icon'
        onPress={() => navigation.navigate('login')}
      >
        <Icon as={LogInIcon} />
      </Button>
    )

  return (
    <Image
      className='size-9 self-start rounded-full object-cover'
      source={
        data.user.image
          ? { uri: data.user.image }
          : require('../../../assets/icon-light.png')
      }
    />
  )
}

function HeaderTitle() {
  const { theme } = useUniwind()

  return (
    <Image
      className='size-9 self-center object-contain'
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
      className='self-end'
      onPress={() => navigation.navigate('settings')}
    >
      <Icon as={SettingsIcon} />
    </Button>
  )
}

export default Tabs
export { HeaderLeft, HeaderTitle, HeaderRight }
