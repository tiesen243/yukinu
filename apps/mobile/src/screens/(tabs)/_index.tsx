import { View } from 'react-native'

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Text } from '@/components/ui/text'

export default function TabsIndexScreen() {
  return (
    <View className='px-4'>
      <Text>
        This is the index screen of the tabs navigator. You can edit this screen
        to add more content or functionality as needed.
      </Text>

      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>
            This is a description of the card. You can add more details here to
            explain the content of the card or provide additional information to
            the user.
          </CardDescription>
        </CardHeader>
      </Card>
    </View>
  )
}
