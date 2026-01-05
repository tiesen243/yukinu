import type { GestureResponderEvent } from 'react-native'

import { useNavigation } from '@react-navigation/native'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Alert, Image, Linking, View } from 'react-native'

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
          <View className='flex-row items-center gap-2'>
            <Text variant='h3'>{data.profile.fullName}</Text>
            <Text className='text-muted-foreground'>@{data.username}</Text>
          </View>

          <Text className='text-muted-foreground'>{data.email}</Text>

          <Text className='text-lg'>{data.profile.bio?.trim()}</Text>
        </View>

        <View className='my-4'>
          <Text>Date of Birth: {data.profile.dateOfBirth}</Text>
          <Text>Gender: {data.profile.gender}</Text>
          <Text>
            Member since{' '}
            {new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }).format(new Date(data.createdAt))}
          </Text>
        </View>

        <View className='flex-row gap-2'>
          <Button
            className='flex-1'
            onPress={() => Linking.openURL(`${getBaseUrl()}/account`)}
          >
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

      await deleteAccessToken()
      await deleteSessionToken()
      queryClient.setQueriesData(trpc.user.profile.queryFilter(), null)
      queryClient.setQueriesData(trpc.auth.currentUser.queryFilter(), null)
    },
    onError: ({ message }) => Alert.alert('Error', message),
  })

  return (
    <Button
      variant='outline'
      className='flex-1'
      onPress={mutate}
      disabled={isPending}
    >
      <Text>Log Out</Text>
    </Button>
  )
}
