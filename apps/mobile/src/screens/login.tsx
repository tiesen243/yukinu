import type { LoginInput, LoginOutput } from '@yukinu/validators/auth'
import type { GestureResponderEvent } from 'react-native'

import { useNavigation } from '@react-navigation/native'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { Alert, Linking, View } from 'react-native'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { setAccessToken, setSessionToken } from '@/lib/secure-store'
import { trpc } from '@/lib/trpc'
import { getBaseUrl } from '@/lib/utils'

export default function LoginScreen() {
  const navigation = useNavigation()

  const [data, setData] = useState({
    identifier: '',
    password: '',
  })

  const { mutate, error, isPending } = useMutation<
    LoginOutput,
    Record<keyof LoginInput, string> & { message?: string },
    GestureResponderEvent
  >({
    mutationFn: async (_: GestureResponderEvent) => {
      const response = await fetch(`${getBaseUrl()}/api/auth/sign-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error(await response.text())

      return response.json() as Promise<LoginOutput>
    },
    meta: { filter: trpc.user.profile.queryFilter() },
    onSuccess: async (data) => {
      await setSessionToken(data.token)
      await setAccessToken(data.accessToken)
      navigation.navigate('tabs', { screen: 'index', pop: true })
    },
    onError: (error) =>
      error.message && Alert.alert('Login Failed', error.message),
  })

  return (
    <View className='flex-1 bg-background items-center justify-center px-4'>
      <View className='w-full max-w-2xl gap-4 overflow-hidden rounded-xl bg-card py-4 ring-1 ring-foreground/10'>
        <View className='grid auto-rows-min items-start gap-1 rounded-t-xl px-4'>
          <Text className='text-center' variant='h4'>
            Login
          </Text>
          <Text className='text-muted-foreground text-sm'>
            Welcome back! Please enter your credentials to log in.
          </Text>
        </View>

        <View className='px-4 gap-4'>
          <View className='gap-2'>
            <Text className='text-sm font-medium'>Email or Username</Text>
            <Input
              placeholder='Enter your identifier'
              textContentType='username'
              value={data.identifier}
              onChangeText={(text) =>
                setData((prev) => ({ ...prev, identifier: text }))
              }
              editable={!isPending}
            />
            {error?.identifier && (
              <Text className='text-destructive text-sm'>
                {error.identifier}
              </Text>
            )}
          </View>

          <View className='gap-2'>
            <Text className='text-sm font-medium'>Password</Text>
            <Input
              placeholder='Enter your password'
              textContentType='password'
              value={data.password}
              onChangeText={(text) =>
                setData((prev) => ({ ...prev, password: text }))
              }
              editable={!isPending}
              secureTextEntry
            />
            {error?.password && (
              <Text className='text-destructive text-sm'>{error.password}</Text>
            )}
          </View>
        </View>

        <View className='items-center rounded-b-xl px-4'>
          <Button className='w-full' onPress={mutate} disabled={isPending}>
            <Text>Login</Text>
          </Button>

          <Text className='w-full mt-4 text-sm text-muted-foreground'>
            Don&#39;t have an account?{' '}
            <Text
              className='text-sm text-primary'
              onPress={() => Linking.openURL(`${getBaseUrl()}/register`)}
            >
              Register now
            </Text>
          </Text>
        </View>
      </View>
    </View>
  )
}
