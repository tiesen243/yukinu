import { useNavigation } from '@react-navigation/native'
import { Text, View } from 'react-native'

import { Button } from '@/components/ui/button'

export function NotFoundScreen() {
  const navigation = useNavigation()

  return (
    <View className='flex-1 bg-background'>
      <View className='container flex-1 items-center justify-center'>
        <Text
          className='mb-6 scroll-m-20 text-4xl text-balance text-foreground'
          style={{ fontFamily: 'Geist_700Bold' }}
        >
          404 - Not Found
        </Text>

        <Button
          onPress={() =>
            navigation.navigate('tabs', { screen: 'index' }, { pop: true })
          }
        >
          Take me home
        </Button>
      </View>
    </View>
  )
}
