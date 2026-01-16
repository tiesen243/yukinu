import type { OurFileRouter } from '@yukinu/uploadthing/types'

import { toast } from '@yukinu/ui/sonner'
import * as ImagePicker from 'expo-image-picker'
import { openSettings } from 'expo-linking'
import { Alert } from 'react-native'

import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useUploadThing } from '@/lib/uploadthing'

export const UploadButton: React.FC<
  React.ComponentProps<typeof Button> & {
    aspectRatio?: [number, number]
    endpoint: keyof OurFileRouter
    onUploadComplete: (url: string) => void
  }
> = ({ aspectRatio = [1, 1], endpoint, onUploadComplete, ...props }) => {
  const ut = useUploadThing(endpoint, {
    onClientUploadComplete: ([res]) => {
      if (res?.ufsUrl) onUploadComplete(res.ufsUrl)
      else toast.error('Failed to upload')
    },
    onUploadError: ({ message }) => Alert.alert('Upload Error', message),
  })

  return (
    <Button
      {...props}
      onPress={async () => {
        const permissionResult =
          await ImagePicker.requestMediaLibraryPermissionsAsync()

        if (!permissionResult.granted)
          return Alert.alert(
            'Permission required',
            'Permission to access the media library is required.',
            [
              { text: 'Dismiss', style: 'cancel' },
              { text: 'Open Settings', onPress: openSettings },
            ],
          )

        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          cameraType: ImagePicker.CameraType.back,
          shape: 'rectangle',
          aspect: aspectRatio,
          quality: 1,
        })

        const asset = result.assets?.at(0)
        if (result.canceled || !asset) return

        const blob = await fetch(asset.uri).then((r) => r.blob())
        const file = Object.assign(
          new File([blob], asset.uri.split('/').pop() ?? 'untitled', {
            type: asset.mimeType ?? asset.type ?? 'application/octet-stream',
          }),
          { uri: asset.uri },
        )

        await ut.startUpload([file])
      }}
      disabled={ut.isUploading}
    >
      <Text>{ut.isUploading ? 'Uploading...' : 'Upload'}</Text>
    </Button>
  )
}
