import { TouchableOpacity, View } from 'react-native'
import { Uniwind, useUniwind } from 'uniwind'

import { RadioCircle } from '@/components/radio-circle'
import { Text } from '@/components/ui/text'

export default function SettingsScreen() {
  const { theme, hasAdaptiveThemes } = useUniwind()
  const resolvedTheme = hasAdaptiveThemes ? 'system' : theme

  return (
    <View className='flex-1 bg-background'>
      <View className='container flex-1 py-4'>
        <Text variant='h4'>Display</Text>

        <View className='mt-4 flex-col gap-4'>
          {availableThemes.map((mode) => (
            <TouchableOpacity
              key={mode.value}
              activeOpacity={0.8}
              className='flex-row items-center justify-between'
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

const availableThemes = [
  { label: 'Light Mode', value: 'light' },
  { label: 'Dark Mode', value: 'dark' },
  { label: 'System Default', value: 'system' },
] as const
