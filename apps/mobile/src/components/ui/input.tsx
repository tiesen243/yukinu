import { cn } from '@yukinu/ui'
import { TextInput } from 'react-native'

function Input({
  className,
  placeholderTextColorClassName: _,
  ...props
}: React.ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      data-slot='input'
      className={cn(
        'h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-base text-foreground shadow-xs transition-[color,box-shadow] outline-none md:text-sm dark:bg-input/30',
        props.editable === false &&
          'web:pointer-events-none web:cursor-not-allowed opacity-50',
        'web:focus-visible:border-ring web:focus-visible:ring-3 web:focus-visible:ring-ring/50 native:placeholder:text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
