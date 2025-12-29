import { useNavigation } from '@react-navigation/native'
import { buttonVariants } from '@yukinu/ui/button'
import { Pressable, Text, View } from 'react-native'
import { Uniwind } from 'uniwind'

export function NotFoundScreen() {
  const navigation = useNavigation()
  Uniwind.setTheme('light')

  return (
    <View className='bg-background py-4 flex-1'>
      <View className='container h-full flex flex-col items-center justify-center gap-6'>
        <Text className='text-4xl font-[Geist\_700Bold] font-bold scroll-m-20 text-balance text-foreground'>
          404 - Not Found
        </Text>

        <Pressable
          className={buttonVariants({ size: 'lg' })}
          onPress={() => navigation.navigate('index', undefined, { pop: true })}
        >
          <Text className='text-primary-foreground'>Take me home</Text>
        </Pressable>
      </View>
    </View>
  )
}
