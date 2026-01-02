import type { GestureResponderEvent } from 'react-native'

import { useNavigation } from '@react-navigation/native'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Alert, Image, View } from 'react-native'

import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import {
  deleteAccessToken,
  deleteSessionToken,
  getSessionToken,
} from '@/lib/secure-store'
import { trpc } from '@/lib/trpc'
import { getBaseUrl } from '@/lib/utils'

export default function ProfileScreen() {
  const { data, isLoading } = useQuery(trpc.user.profile.queryOptions({}))
  const navigation = useNavigation()

  if (isLoading)
    return (
      <View className='flex-1 bg-background'>
        <View className='flex-1 items-center justify-center'>
          <Text>Loading...</Text>
        </View>
      </View>
    )

  if (!data)
    return (
      <View className='flex-1 bg-background'>
        <View className='flex-1 items-center justify-center gap-4'>
          <Text>You are not logged in.</Text>
          <Button onPress={() => navigation.navigate('login')}>
            <Text>Login</Text>
          </Button>
        </View>
      </View>
    )

  return (
    <View className='flex-1 bg-background'>
      <View className='bg-secondary w-full h-48 items-center justify-center' />
      <View className='flex-1 container -mt-24'>
        <Image
          className='size-36 rounded-full ring-4 ring-background'
          source={
            data.image
              ? { uri: data.image }
              : require('../../../assets/icon-light.png')
          }
        />
        <View className='mt-4 gap-1'>
          <Text variant='h3'>{data.profile.fullName}</Text>
          <Text className='text-sm text-muted-foreground'>{data.email}</Text>

          <Text className='mt-4'>{data.profile.bio}</Text>
        </View>

        <View className='mt-6 gap-4'>
          <Button>
            <Text>Edit Profile</Text>
          </Button>

          <LogOutButton />
        </View>
      </View>
    </View>
  )
}

const LogOutButton: React.FC = () => {
  const queryClient = useQueryClient()
  const navigation = useNavigation()

  const { mutate, isPending } = useMutation({
    mutationFn: async (_: GestureResponderEvent) => {
      const response = await fetch(`${getBaseUrl()}/api/auth/sign-out`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getSessionToken()}`,
        },
      })
      if (!response.ok) throw new Error(await response.text())
    },
    onSuccess: async () => {
      navigation.navigate('login')
      queryClient.setQueriesData(trpc.user.profile.queryFilter(), null)
      await deleteSessionToken()
      await deleteAccessToken()
    },
    onError: ({ message }) => Alert.alert('Error', message),
  })

  return (
    <Button variant='outline' onPress={mutate} disabled={isPending}>
      <Text>Log Out</Text>
    </Button>
  )
}
