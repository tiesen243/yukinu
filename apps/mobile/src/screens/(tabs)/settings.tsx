import { Text, View } from 'react-native'

export function SettingsScreen() {
  return (
    <View className='bg-background flex-1'>
      <View className='container py-4'>
        <Text
          className='text-4xl scroll-m-20 text-balance text-foreground'
          style={{ fontFamily: 'Geist_700Bold' }}
        >
          Settings Screen
        </Text>
      </View>
    </View>
  )
}
