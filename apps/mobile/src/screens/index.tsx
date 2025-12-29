import { Link } from '@react-navigation/native'
import { Text, View } from 'react-native'

export function IndexScreen() {
  return (
    <View className='bg-background py-4 flex-1'>
      <View className='container'>
        <Text className='text-4xl font-[Geist_700Bold] font-bold scroll-m-20 text-balance text-foreground'>
          Welcome to Yukinu Mobile!
        </Text>

        <View className='mt-4 space-y-2'>
          <Link screen='about' className='text-primary-foreground text-lg'>
            Go to About Page
          </Link>
          <Link screen='notFound' className='text-primary-foreground text-lg'>
            Go to Not Found Page
          </Link>
        </View>
      </View>
    </View>
  )
}
