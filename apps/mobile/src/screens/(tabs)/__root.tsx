import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { EllipsisVerticalIcon } from 'lucide-react-native'
import { lazy } from 'react'
import { Image } from 'react-native'
import { useUniwind } from 'uniwind'

import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import IndexScreen from '@/screens/(tabs)/_index'

const Tabs = createMaterialTopTabNavigator({
  initialRouteName: 'index',
  screenOptions: {},
  screens: {
    index: { screen: IndexScreen, options: { title: 'For you' } },
    following: {
      screen: lazy(() => import('@/screens/(tabs)/following')),
      options: { title: 'Following' },
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
  return (
    <Button variant='ghost' size='icon'>
      <Icon as={EllipsisVerticalIcon} />
    </Button>
  )
}

export default Tabs
export { HeaderLeft, HeaderTitle, HeaderRight }
