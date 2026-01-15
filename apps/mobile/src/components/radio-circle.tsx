import { View } from 'react-native'

export const RadioCircle: React.FC<{ selected: boolean }> = ({ selected }) => (
  <View
    className={
      selected
        ? 'size-5 items-center justify-center rounded-full border-2 border-primary'
        : 'size-5 rounded-full border-2 border-muted-foreground'
    }
  >
    {selected && <View className='size-3 rounded-full bg-primary' />}
  </View>
)
