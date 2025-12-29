import { useNavigation } from '@react-navigation/native'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Alert, Image, Text, View } from 'react-native'

import { Button } from '@/components/ui/button'
import { deleteAccessToken, deleteSessionToken } from '@/lib/store'
import { trpc } from '@/lib/trpc'
import { getBaseUrl } from '@/lib/utils'

export function ProfileScreen() {
  const navigation = useNavigation()

  const { data, isLoading, isError } = useQuery(
    trpc.auth.getCurrentUser.queryOptions(),
  )

  const { mutate, isPending } = useMutation({
    mutationKey: ['auth', 'logout'],
    mutationFn: async () => {
      const response = await fetch(`${getBaseUrl()}/api/auth/sign-out`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data?.token}`,
        },
      })
      if (!response.ok) throw new Error(await response.text())
    },
    meta: { filter: trpc.auth.getCurrentUser.queryFilter() },
    onSuccess: async () => {
      await deleteAccessToken()
      await deleteSessionToken()
      navigation.navigate('login')
    },
    onError: (error) => Alert.alert('Error', error.message),
    retry: false,
  })

  if (isLoading)
    return (
      <View className='bg-background flex-1 justify-center items-center'>
        <Text className='text-foreground'>Loading...</Text>
      </View>
    )

  if (isError || !data?.user)
    return (
      <View className='bg-background flex-1 justify-center items-center'>
        <Text className='text-foreground mb-4'>You are not logged in.</Text>
        <Button onPress={() => navigation.navigate('login')}>
          Go to Login
        </Button>
      </View>
    )

  return (
    <View className='bg-background flex-1 py-4'>
      <View className='container'>
        <View className='flex flex-row items-center gap-4'>
          <Image
            source={{ uri: data.user.image ?? '' }}
            className='size-16 rounded-full'
          />

          <View className='flex flex-col gap-1'>
            <Text className='text-foreground text-xl'>
              {data.user.username}
            </Text>
            <Text className='text-muted-foreground text-lg'>
              {data.user.email}
            </Text>
          </View>
        </View>

        <Button className='mt-8' onPress={() => mutate()} disabled={isPending}>
          Logout
        </Button>
      </View>
    </View>
  )
}
