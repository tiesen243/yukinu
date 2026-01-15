import { useNavigation } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  View,
} from 'react-native'
import { useUniwind } from 'uniwind'

import { Text } from '@/components/ui/text'
import { trpc } from '@/lib/trpc'

const phoneWidth = Dimensions.get('window').width
const itemWidth = phoneWidth / 2 - 24 // 16px gap + 8px padding

export default function IndexScreen() {
  return (
    <View className='flex-1 bg-background'>
      <ProductsList />
    </View>
  )
}

const ProductsList: React.FC = () => {
  const navigation = useNavigation()
  const { theme } = useUniwind()

  const { data, isLoading, refetch, isRefetching } = useQuery(
    trpc.product.all.queryOptions({
      search: '',
      vendorId: null,
      categoryId: null,
      orderBy: 'createdAt_desc',
      limit: 6,
    }),
  )

  if (isLoading)
    return (
      <FlatList
        data={Array.from({ length: 6 }).fill(null)}
        keyExtractor={(_, idx) => idx.toString()}
        numColumns={2}
        columnWrapperClassName='container pt-4 gap-4'
        renderItem={() => (
          <View
            style={{ width: itemWidth, height: (itemWidth / 3) * 4 }}
            className='mb-4 rounded-xl bg-card ring-1 ring-foreground/10'
          >
            <View className='aspect-square w-full rounded-t-xl bg-muted' />

            <View className='w-full gap-2 p-4'>
              <Text className='rounded-md bg-muted'>&nbsp;</Text>
              <Text className='w-1/3 rounded-md bg-muted text-sm'>&nbsp;</Text>
            </View>
          </View>
        )}
      />
    )

  return (
    <FlatList
      data={data?.products ?? []}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperClassName='container pt-4 gap-4'
      refreshControl={
        <RefreshControl
          onRefresh={() => refetch()}
          refreshing={isRefetching}
          colors={[theme === 'dark' ? '#ffffff' : '#000000']}
          progressBackgroundColor={theme === 'dark' ? '#0a0a0a' : '#ffffff'}
        />
      }
      renderItem={({ item }) => (
        <Pressable
          style={{ width: itemWidth, height: (itemWidth / 3) * 4 }}
          className='mb-4 rounded-xl bg-card ring-1 ring-foreground/10'
          onPress={() =>
            navigation.navigate('productDetails', { productId: item.id })
          }
        >
          <Image
            source={{ uri: item.image ?? '' }}
            className='aspect-square w-full rounded-t-xl'
            resizeMode='cover'
          />

          <View className='w-full gap-2 p-4'>
            <Text className='line-clamp-1'>{item.name}</Text>
            <Text className='text-sm text-muted-foreground'>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(+item.price)}
            </Text>
          </View>
        </Pressable>
      )}
    />
  )
}
