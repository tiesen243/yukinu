import type { StaticScreenProps } from '@react-navigation/native'

import { useNavigation } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { RefreshControl, ScrollView, View } from 'react-native'
import { useUniwind } from 'uniwind'

import { Text } from '@/components/ui/text'
import { trpc } from '@/lib/trpc'

export default function ProductDetailsScreen({
  route,
}: StaticScreenProps<{ productId: string }>) {
  const navigation = useNavigation()
  const { theme } = useUniwind()

  const { data, isLoading, refetch, isRefetching } = useQuery(
    trpc.product.one.queryOptions({ id: route.params.productId }),
  )

  useEffect(() => {
    if (data?.name)
      navigation.setOptions({
        title: data.name,
      })
  }, [data?.name, navigation])

  if (isLoading)
    return (
      <View className='flex-1 bg-background'>
        <View className='flex-1 container py-4'>
          <Text>Loading...</Text>
        </View>
      </View>
    )

  return (
    <View className='flex-1 bg-background'>
      <ScrollView
        className='flex-1 container pt-4'
        refreshControl={
          <RefreshControl
            onRefresh={() => refetch()}
            refreshing={isRefetching}
            colors={[theme === 'dark' ? '#ffffff' : '#000000']}
            progressBackgroundColor={theme === 'dark' ? '#0a0a0a' : '#ffffff'}
          />
        }
      >
        <Text>{JSON.stringify(data, null, 2)}</Text>
      </ScrollView>
    </View>
  )
}
