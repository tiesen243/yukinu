import { useQuery } from '@tanstack/react-query'
import { Text, View } from 'react-native'

import { trpc } from '@/lib/trpc'

export function IndexScreen() {
  const { data, isLoading } = useQuery(
    trpc.product.all.queryOptions({
      search: '',
      categoryId: null,
      vendorId: null,
      orderBy: 'createdAt_desc',
    }),
  )

  return (
    <View className='bg-background py-4 flex-1'>
      <View className='container'>
        <Text
          className='text-4xl scroll-m-20 text-balance text-foreground'
          style={{ fontFamily: 'Geist_700Bold' }}
        >
          Welcome to Yukinu Mobile!
        </Text>

        {isLoading ? (
          <Text className='text-foreground mt-4'>Loading...</Text>
        ) : (
          <Text className='text-foreground mt-4'>
            {JSON.stringify(data, null, 2)}
          </Text>
        )}
      </View>
    </View>
  )
}
