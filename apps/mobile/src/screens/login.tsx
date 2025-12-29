import type { AuthValidators } from '@yukinu/validators/auth'

import { useNavigation } from '@react-navigation/native'
import { useMutation } from '@tanstack/react-query'
import { buttonVariants } from '@yukinu/ui/button'
import * as React from 'react'
import { Alert, Pressable, Text, TextInput, View } from 'react-native'

import { setAccessToken, setSessionToken } from '@/lib/store'
import { getBaseUrl } from '@/lib/utils'

export function LoginScreen() {
  const navigation = useNavigation()
  const [data, setData] = React.useState({ identifier: '', password: '' })

  const { mutate, isPending } = useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: async () => {
      const response = await fetch(`${getBaseUrl()}/api/auth/sign-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error(await response.text())
      return response.json() as Promise<AuthValidators.LoginOutput>
    },
    onSuccess: (data) => {
      setSessionToken(data.token)
      setAccessToken(data.accessToken)
      navigation.navigate('main')
    },
    onError: (error) => Alert.alert('Error', error.message),
  })

  return (
    <View className='bg-background flex-1'>
      <View className='container h-full py-4 flex flex-col gap-4 justify-center items-center'>
        <View className='w-full'>
          <Text
            className='text-2xl scroll-m-20 text-balance text-foreground'
            style={{ fontFamily: 'Geist_600SemiBold' }}
          >
            Login
          </Text>
          <Text className='text-muted-foreground'>
            Please enter your credentials to log in.
          </Text>
        </View>

        <View className='w-full flex flex-col gap-2'>
          <Text
            className='text-foreground'
            style={{ fontFamily: 'Geist_500Medium' }}
          >
            Identifier
          </Text>
          <TextInput
            placeholder='Enter your username or email'
            className='text-foreground bg-input rounded-md px-2 placeholder:text-muted-foreground'
            onChangeText={(text) => setData({ ...data, identifier: text })}
            aria-disabled={isPending}
          />
        </View>
        <View className='w-full flex flex-col gap-2'>
          <Text
            className='text-foreground'
            style={{ fontFamily: 'Geist_500Medium' }}
          >
            Password
          </Text>
          <TextInput
            placeholder='Password'
            className='text-foreground bg-input rounded-md px-2 placeholder:text-muted-foreground'
            onChangeText={(text) => setData({ ...data, password: text })}
            aria-disabled={isPending}
            secureTextEntry
          />
        </View>

        <Pressable
          className={buttonVariants({ className: 'w-full' })}
          onPress={() => mutate()}
          disabled={isPending}
        >
          <Text
            className='text-primary-foreground'
            style={{ fontFamily: 'Geist_500Medium' }}
          >
            Login
          </Text>
        </Pressable>
      </View>
    </View>
  )
}
