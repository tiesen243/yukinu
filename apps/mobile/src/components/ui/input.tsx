import type { TextInputProps } from 'react-native'

import { cn } from '@yukinu/ui'
import { TextInput } from 'react-native'
import { useUniwind } from 'uniwind'

function Input({
  className,
  placeholderTextColorClassName: _,
  placeholderTextColor: __,
  ...props
}: TextInputProps & React.RefAttributes<TextInput>) {
  const { theme } = useUniwind()
  return (
    <TextInput
      className={cn(
        'h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-base text-foreground outline-none md:text-sm dark:bg-input/30',
        props.editable === false && 'opacity-50',
        className,
      )}
      placeholderTextColor={theme === 'dark' ? '#a4a4a4' : '#525252'}
      {...props}
    />
  )
}

export { Input }
