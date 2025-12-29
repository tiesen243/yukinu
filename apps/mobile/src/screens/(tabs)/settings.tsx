import { Text, View } from 'react-native'

export function SettingsScreen() {
  return (
    <View className='flex-1 bg-background py-4'>
      <View className='container'>
        <Text
          className='scroll-m-20 text-4xl text-balance text-foreground'
          style={{ fontFamily: 'Geist_700Bold' }}
        >
          Settings Screen
        </Text>
      </View>
    </View>
  )
}
