import { Text, View } from 'react-native'

export function AboutScreen() {
  return (
    <View className='bg-background py-4 flex-1'>
      <View className='container'>
        <Text className='text-4xl font-[Geist_700Bold] font-bold scroll-m-20 text-balance text-foreground'>
          About Yukinu Mobile
        </Text>

        <Text className='mt-4 text-lg leading-7 text-foreground'>
          Yukinu Mobile is the mobile application version of Yukinu, designed to
          provide users with a seamless experience on their mobile devices.
          Explore features, stay updated, and enjoy the convenience of Yukinu on
          the go!
        </Text>
      </View>
    </View>
  )
}
