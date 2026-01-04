import { useQuery } from '@tanstack/react-query'
import { Image, View } from 'react-native'

import { Text } from '@/components/ui/text'
import { trpc } from '@/lib/trpc'

export default function IndexScreen() {
  return (
    <View className='flex-1 bg-background'>
      <View className='container flex-1 py-4'>
        <View className='flex-1 grid grid-cols-2 gap-4'>
          <ProductsList />
        </View>
      </View>
    </View>
  )
}

const ProductsList: React.FC = () => {
  const { data, isLoading } = useQuery(
    trpc.product.all.queryOptions({
      search: '',
      vendorId: null,
      categoryId: null,
      orderBy: 'createdAt_desc',
      limit: 6,
    }),
  )

  if (isLoading) return <Text>Loading...</Text>

  return data?.products.map((product) => (
    <View
      key={product.id}
      className='w-1/2 bg-card border border-border rounded-xl'
    >
      <Image
        source={{ uri: product.image ?? '' }}
        className='w-full aspect-square rounded-t-xl object-cover'
      />
      <View className='p-4'>
        <Text>{product.name}</Text>
      </View>
    </View>
  ))
}
