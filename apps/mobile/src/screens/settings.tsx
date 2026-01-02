import { TouchableOpacity, View } from 'react-native'
import { Uniwind, useUniwind } from 'uniwind'

import { Text } from '@/components/ui/text'

export default function SettingsScreen() {
  const { theme, hasAdaptiveThemes } = useUniwind()
  const resolvedTheme = hasAdaptiveThemes ? 'system' : theme

  return (
    <View className='flex-1 bg-background'>
      <View className='flex-1 container py-4'>
        <Text variant='h4'>Display</Text>

        <View className='mt-4 flex-col gap-4'>
          {availableThemes.map((mode) => (
            <TouchableOpacity
              key={mode.value}
              activeOpacity={0.8}
              className='flex-row justify-between items-center'
              accessibilityLabel={`Set theme to ${mode.label}`}
              onPress={() => Uniwind.setTheme(mode.value)}
            >
              <Text>{mode.label}</Text>
              <RadioCircle selected={resolvedTheme === mode.value} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  )
}

const RadioCircle: React.FC<{ selected: boolean }> = ({ selected }) => (
  <View
    className={
      selected
        ? 'size-5 rounded-full border-2 border-primary items-center justify-center'
        : 'size-5 rounded-full border-2 border-muted-foreground'
    }
  >
    {selected && <View className='size-3 rounded-full bg-primary' />}
  </View>
)

const availableThemes = [
  { label: 'Light Mode', value: 'light' },
  { label: 'Dark Mode', value: 'dark' },
  { label: 'System Default', value: 'system' },
] as const
