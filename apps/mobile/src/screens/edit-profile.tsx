import type { UpdateProfileInput } from '@yukinu/validators/user'

import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { genders, updateProfileInput } from '@yukinu/validators/user'
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native'

import { RadioCircle } from '@/components/radio-circle'
import { Spinner } from '@/components/spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { UploadButton } from '@/components/upload-button'
import { trpc } from '@/lib/trpc'

export default function EditProfile() {
  const { data, isLoading } = useQuery(trpc.user.profile.queryOptions({}))
  const { mutateAsync } = useMutation({
    ...trpc.user.updateProfile.mutationOptions(),
    meta: { filter: trpc.user.profile.pathFilter() },
    onSuccess: () => Alert.alert('Success', 'Profile updated successfully'),
    onError: ({ message }) => Alert.alert('Error', message),
  })

  const { FormField, handleSubmit, state } = useForm({
    defaultValues: {
      fullName: data?.profile.fullName,
      bio: data?.profile.bio,
      gender: data?.profile.gender,
      dateOfBirth: data?.profile.dateOfBirth,
      avatar: data?.image,
      banner: data?.profile.banner,
    } as Omit<UpdateProfileInput, 'id'>,
    schema: updateProfileInput.omit({ id: true }),
    onSubmit: mutateAsync,
  })

  if (isLoading) return <Spinner />

  return (
    <KeyboardAvoidingView
      behavior='padding'
      keyboardVerticalOffset={120}
      className='flex-1 bg-background'
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        className='container py-4'
      >
        <FormField
          name='avatar'
          render={({ field: { value: uri, onChange } }) => (
            <View className='mb-4 items-center gap-2'>
              <Text className='self-start'>Avatar</Text>
              <View className='flex-row gap-2'>
                <Input
                  keyboardType='url'
                  placeholder='Enter your avatar URL'
                  value={uri ?? ''}
                  onChangeText={onChange}
                  className='flex-1'
                />
                <UploadButton
                  variant='outline'
                  endpoint='avatarUploader'
                  onUploadComplete={(url) => onChange(url)}
                />
              </View>

              <Image
                source={uri ? { uri } : require('../../assets/logo-light.png')}
                className='mx-auto size-24 rounded-full'
                resizeMode='cover'
              />
            </View>
          )}
        />

        <FormField
          name='banner'
          render={({ field: { value: uri, onChange } }) => (
            <View className='mb-4 items-center gap-2'>
              <Text className='self-start'>Banner</Text>
              <View className='flex-row gap-2'>
                <Input
                  keyboardType='url'
                  placeholder='Enter your banner URL'
                  value={uri ?? ''}
                  onChangeText={onChange}
                  className='flex-1'
                />
                <UploadButton
                  variant='outline'
                  aspectRatio={[3, 1]}
                  endpoint='bannerUploader'
                  onUploadComplete={(url) => onChange(url)}
                />
              </View>

              {uri ? (
                <Image
                  source={{ uri }}
                  className='aspect-video w-full rounded-lg'
                  resizeMode='cover'
                />
              ) : (
                <View className='aspect-video w-full rounded-lg bg-secondary' />
              )}
            </View>
          )}
        />

        <FormField
          name='fullName'
          render={({ field: { value, onChange }, meta: { errors } }) => (
            <View className='mb-4 gap-2'>
              <Text>Full Name</Text>
              <Input
                placeholder='Enter your full name'
                value={value ?? ''}
                onChangeText={onChange}
              />
              {errors[0] && (
                <Text className='text-sm text-destructive'>
                  {errors[0].message}
                </Text>
              )}
            </View>
          )}
        />

        <FormField
          name='bio'
          render={({ field: { value, onChange }, meta: { errors } }) => (
            <View className='mb-4 gap-2'>
              <Text>Bio</Text>
              <Input
                placeholder='Tell us about yourself...'
                value={value ?? ''}
                onChangeText={onChange}
                className='h-auto min-h-20'
                style={{ textAlignVertical: 'top' }}
                numberOfLines={4}
                multiline
              />
              {errors[0] && (
                <Text className='text-sm text-destructive'>
                  {errors[0].message}
                </Text>
              )}
            </View>
          )}
        />

        <FormField
          name='gender'
          render={({ field: { value, onChange } }) => (
            <View className='mb-4 gap-2'>
              <Text>Gender</Text>
              <View className='flex-row justify-between'>
                {genders.map((gender) => (
                  <TouchableOpacity
                    key={gender}
                    activeOpacity={0.8}
                    onPress={() => onChange(gender)}
                    className='flex-row items-center gap-2'
                  >
                    <RadioCircle selected={value === gender} />
                    <Text>
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        />

        <FormField
          name='dateOfBirth'
          render={({ field: { value, onChange }, meta: { errors } }) => (
            <View className='mb-4 gap-2'>
              <Text>Date of Birth</Text>
              <Input
                keyboardType='numeric'
                placeholder='YYYY-MM-DD'
                value={value ?? ''}
                onChangeText={onChange}
              />
              {errors[0] && (
                <Text className='text-sm text-destructive'>
                  {errors[0].message}
                </Text>
              )}
            </View>
          )}
        />

        <Button onPress={() => handleSubmit()} disabled={state.isPending}>
          <Text>{state.isPending ? 'Saving...' : 'Save Changes'}</Text>
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
