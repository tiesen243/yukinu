import { Link } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { Dimensions, FlatList, Image, View } from 'react-native'

import { Text } from '@/components/ui/text'
import { trpc } from '@/lib/trpc'

const phoneWidth = Dimensions.get('window').width
const itemWidth = phoneWidth / 2 - 24 // 16px gap + 8px padding

export default function IndexScreen() {
  return (
    <View className='flex-1 bg-background'>
      <View className='container flex-1 py-4'>
        <ProductsList />
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

  return (
    <FlatList
      data={data?.products ?? []}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={{ gap: 16 }}
      renderItem={({ item }) => (
        <Link
          screen='productDetails'
          params={{ productId: item.id }}
          style={{ width: itemWidth }}
          className='bg-card border border-border rounded-xl gap-4'
        >
          <Image
            source={{ uri: item.image ?? '' }}
            style={{ width: itemWidth, height: itemWidth }}
            className='rounded-t-xl object-cover'
          />

          <View className='p-4 pt-8 w-full'>
            <Text className='line-clamp-1'>{item.name}</Text>
            <Text className='text-muted-foreground text-sm'>
              {Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(+item.price)}
            </Text>
          </View>
        </Link>
      )}
    />
  )
}
