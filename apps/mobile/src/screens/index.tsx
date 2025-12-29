import { Link } from '@react-navigation/native'
import { Text, View } from 'react-native'

export function IndexScreen() {
  return (
    <View className='bg-background py-4 flex-1'>
      <View className='container'>
        <Text
          className='text-4xl scroll-m-20 text-balance text-foreground'
          style={{ fontFamily: 'Geist_700Bold' }}
        >
          Welcome to Yukinu Mobile!
        </Text>

        <Text
          className='mt-4 text-lg leading-7 text-foreground'
          style={{ fontFamily: 'Geist_400Regular' }}
        >
          Yukinu Mobile is your gateway to a world of seamless mobile
          experiences. Navigate through the app to explore its features and
          functionalities.
        </Text>

        <View className='mt-4 space-y-2'>
          <Link
            screen='about'
            className='text-primary-foreground text-lg'
            style={{ fontFamily: 'Geist_500Medium' }}
          >
            Go to About Page
          </Link>
          <Link
            screen='notFound'
            className='text-primary-foreground text-lg'
            style={{ fontFamily: 'Geist_500Medium' }}
          >
            Go to Not Found Page
          </Link>
        </View>
      </View>
    </View>
  )
}
