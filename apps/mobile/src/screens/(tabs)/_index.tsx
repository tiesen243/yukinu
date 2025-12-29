import { useNavigation } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { Text, View } from 'react-native'

import { Button } from '@/components/ui/button'
import { trpc } from '@/lib/trpc'

export function IndexScreen() {
  const navigation = useNavigation()

  const { data, isLoading } = useQuery(
    trpc.product.all.queryOptions({
      search: '',
      categoryId: null,
      vendorId: null,
      orderBy: 'createdAt_desc',
    }),
  )

  return (
    <View className='flex-1 bg-background py-4'>
      <View className='container'>
        <Text
          className='scroll-m-20 text-4xl text-balance text-foreground'
          style={{ fontFamily: 'Geist_700Bold' }}
        >
          Welcome to Yukinu Mobile!
        </Text>

        {isLoading ? (
          <Text className='mt-4 text-foreground'>Loading...</Text>
        ) : (
          <Text className='mt-4 text-foreground'>
            {JSON.stringify(data, null, 2)}
          </Text>
        )}

        <Button
          size='lg'
          className='mt-8'
          onPress={() => navigation.navigate('redux')}
        >
          <Text className='text-primary-foreground'>Go to Redux Screen</Text>
        </Button>
      </View>
    </View>
  )
}
