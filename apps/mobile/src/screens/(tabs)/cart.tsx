import { View } from 'react-native'

import { Text } from '@/components/ui/text'

export default function CartScreen() {
  return (
    <View className='flex-1 bg-background'>
      <View className='container flex-1 items-center justify-center'>
        <Text variant='h5' className='text-muted-foreground'>
          Your Cart is Empty
        </Text>
      </View>
    </View>
  )
}
