import { useNavigation } from '@react-navigation/native'
import { Text, View } from 'react-native'

import { Button } from '@/components/ui/button'

export function NotFoundScreen() {
  const navigation = useNavigation()

  return (
    <View className='bg-background flex-1'>
      <View className='container flex-1 items-center justify-center'>
        <Text
          className='text-4xl scroll-m-20 text-balance text-foreground mb-6'
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
