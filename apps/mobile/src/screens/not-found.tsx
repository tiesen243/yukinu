import { useNavigation } from '@react-navigation/native'
import { buttonVariants } from '@yukinu/ui/button'
import { Pressable, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export function NotFoundScreen() {
  const navigation = useNavigation()

  return (
    <SafeAreaView className='bg-background py-4 flex-1'>
      <View className='container h-full flex flex-col items-center justify-center gap-6'>
        <Text
          className='text-4xl scroll-m-20 text-balance text-foreground'
          style={{ fontFamily: 'Geist_700Bold' }}
        >
          404 - Not Found
        </Text>

        <Pressable
          className={buttonVariants({ size: 'lg' })}
          onPress={() => navigation.navigate('tabs', undefined, { pop: true })}
        >
          <Text
            className='text-primary-foreground'
            style={{ fontFamily: 'Geist_500Medium' }}
          >
            Take me home
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}
