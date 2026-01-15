import { useNavigation } from '@react-navigation/native'
import { useQueryClient } from '@tanstack/react-query'
import { useForm } from '@yukinu/ui/hooks/use-form'
import * as Validators from '@yukinu/validators/auth'
import { Alert, KeyboardAvoidingView, Linking, View } from 'react-native'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { setAccessToken, setSessionToken } from '@/lib/secure-store'
import { trpc } from '@/lib/trpc'
import { getBaseUrl } from '@/lib/utils'

export default function LoginScreen() {
  const navigation = useNavigation()
  const queryClient = useQueryClient()

  const { FormField, handleSubmit, state } = useForm({
    defaultValues: {
      identifier: '',
      password: '',
    },
    schema: Validators.loginInput,
    onSubmit: async (values) => {
      const response = await fetch(`${getBaseUrl()}/api/auth/sign-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      if (!response.ok) throw new Error(await response.text())
      return response.json() as Promise<Validators.LoginOutput>
    },
    onSuccess: async (data) => {
      await setSessionToken(data.token)
      await setAccessToken(data.accessToken)
      await queryClient.invalidateQueries(trpc.auth.currentUser.queryFilter())
      await queryClient.invalidateQueries(trpc.user.profile.queryFilter())
      navigation.navigate('tabs', { screen: 'index', pop: true })
    },
    onError: ({ message }) =>
      Alert.alert('Login Failed', message ?? 'An unknown error occurred'),
  })

  return (
    <KeyboardAvoidingView
      behavior='padding'
      className='flex-1 items-center justify-center bg-background px-4'
    >
      <View className='w-full max-w-2xl gap-4 overflow-hidden rounded-xl bg-card py-4 ring-1 ring-foreground/10'>
        <View className='grid auto-rows-min items-start gap-1 rounded-t-xl px-4'>
          <Text variant='h4'>Login</Text>
          <Text className='text-sm text-muted-foreground'>
            Welcome back! Please enter your credentials to log in.
          </Text>
        </View>

        <View className='gap-4 px-4'>
          <FormField
            name='identifier'
            render={({ field, meta }) => (
              <View className='gap-2'>
                <Text className='font-[GeistMedium] text-sm'>
                  Email or Username
                </Text>
                <Input
                  placeholder='Enter your identifier'
                  textContentType='username'
                  value={field.value}
                  onChangeText={field.onChange}
                />
                {meta.errors[0] && (
                  <Text className='text-sm text-destructive'>
                    {meta.errors[0].message}
                  </Text>
                )}
              </View>
            )}
          />

          <FormField
            name='password'
            render={({ field, meta }) => (
              <View className='gap-2'>
                <Text className='font-[GeistMedium] text-sm'>Password</Text>
                <Input
                  placeholder='Enter your password'
                  textContentType='password'
                  value={field.value}
                  onChangeText={field.onChange}
                  secureTextEntry
                />
                {meta.errors[0] && (
                  <Text className='text-sm text-destructive'>
                    {meta.errors[0].message}
                  </Text>
                )}
              </View>
            )}
          />
        </View>

        <View className='items-center rounded-b-xl px-4'>
          <Button
            className='w-full'
            onPress={() => handleSubmit()}
            disabled={state.isPending}
          >
            <Text>{state.isPending ? 'Logging in...' : 'Login'}</Text>
          </Button>

          <Text className='mt-4 w-full text-sm text-muted-foreground'>
            Don&#39;t have an account?{' '}
            <Text
              className='text-sm text-primary'
              onPress={() => Linking.openURL(`${getBaseUrl()}/register`)}
            >
              Register here
            </Text>
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}
