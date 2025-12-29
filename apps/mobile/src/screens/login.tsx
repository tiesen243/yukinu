import type { AuthValidators } from '@yukinu/validators/auth'

import { useNavigation } from '@react-navigation/native'
import { useMutation } from '@tanstack/react-query'
import * as React from 'react'
import { Alert, Text, TextInput, View } from 'react-native'

import { Button } from '@/components/ui/button'
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
      navigation.navigate('tabs')
    },
    onError: (error) => Alert.alert('Error', error.message),
  })

  return (
    <View className='flex-1 items-center justify-center bg-background'>
      <View className='container gap-6'>
        <View className='w-full'>
          <Text
            className='scroll-m-20 text-2xl text-balance text-foreground'
            style={{ fontFamily: 'Geist_600SemiBold' }}
          >
            Login
          </Text>
          <Text className='text-muted-foreground'>
            Please enter your credentials to log in.
          </Text>
        </View>

        <View className='flex w-full flex-col gap-2'>
          <Text
            className='text-foreground'
            style={{ fontFamily: 'Geist_500Medium' }}
          >
            Identifier
          </Text>
          <TextInput
            placeholder='Enter your username or email'
            className='rounded-md bg-input px-2 text-card-foreground'
            placeholderTextColor='#c0c0c0'
            onChangeText={(text) => setData({ ...data, identifier: text })}
            autoComplete='username'
            textContentType='username'
            aria-disabled={isPending}
            editable={!isPending}
          />
        </View>

        <View className='flex w-full flex-col gap-2'>
          <Text
            className='text-foreground'
            style={{ fontFamily: 'Geist_500Medium' }}
          >
            Password
          </Text>
          <TextInput
            placeholder='Enter your password'
            className='rounded-md bg-input px-2 text-card-foreground'
            placeholderTextColor='#c0c0c0'
            onChangeText={(text) => setData({ ...data, password: text })}
            autoComplete='current-password'
            textContentType='password'
            aria-disabled={isPending}
            editable={!isPending}
            secureTextEntry
          />
        </View>

        <Button onPress={() => mutate()} disabled={isPending}>
          Login
        </Button>
      </View>
    </View>
  )
}
