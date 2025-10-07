'use client'

import * as React from 'react'
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react'

import { cn } from '@yukinu/ui'
import { Button } from '@yukinu/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@yukinu/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@yukinu/ui/popover'

const ComboboxContext = React.createContext<{
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  value: string | null
  onValueChange: (value: string) => void
  selectContent: React.ReactNode | null
  setSelectContent: React.Dispatch<React.SetStateAction<React.ReactNode | null>>
} | null>(null)

const useCombobox = () => {
  const context = React.use(ComboboxContext)
  if (!context)
    throw new Error('Combobox components must be used within a Combobox')
  return context
}

interface ComboboxProps extends React.ComponentProps<typeof Popover> {
  value: string | null
  onValueChange: (value: string) => void
}

function Combobox({ value, onValueChange, ...props }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [selectContent, setSelectContent] =
    React.useState<React.ReactNode | null>(null)

  const contextValue = React.useMemo(
    () => ({
      open,
      setOpen,
      value,
      onValueChange,
      selectContent,
      setSelectContent,
    }),
    [open, setOpen, value, onValueChange, selectContent, setSelectContent],
  )

  return (
    <ComboboxContext value={contextValue}>
      <Popover
        {...props}
        data-slot='combobox'
        open={open}
        onOpenChange={setOpen}
      />
    </ComboboxContext>
  )
}

interface ComboboxTriggerProps
  extends React.ComponentProps<typeof PopoverTrigger> {
  placeholder?: string
}

function ComboboxTrigger({
  className,
  placeholder,
  ...props
}: ComboboxTriggerProps) {
  const { open, value, selectContent } = useCombobox()

  return (
    <PopoverTrigger {...props} data-slot='combobox-trigger' asChild>
      <Button
        variant='outline'
        role='combobox'
        aria-expanded={open}
        className={cn(
          'justify-between',
          !value && 'text-muted-foreground hover:text-muted-foreground',
          className,
        )}
      >
        {selectContent ?? placeholder ?? 'Select an option'}
        <ChevronsUpDownIcon className='opacity-50' />
      </Button>
    </PopoverTrigger>
  )
}

interface ComboboxContentProps
  extends React.ComponentProps<typeof PopoverContent> {
  placeholder?: string
  notFoundContent?: React.ReactNode
}

function ComboboxContent({
  className,
  placeholder,
  notFoundContent,
  children,
  ...props
}: ComboboxContentProps) {
  return (
    <PopoverContent
      {...props}
      data-slot='combobox-content'
      className={cn('w-(--radix-popover-trigger-width)', className)}
    >
      <Command>
        <CommandInput placeholder={placeholder ?? 'Type to search...'} />
        <CommandList>
          <CommandEmpty>{notFoundContent ?? 'No results found.'}</CommandEmpty>
          <CommandGroup>{children}</CommandGroup>
        </CommandList>
      </Command>
    </PopoverContent>
  )
}

function ComboboxItem({
  children,
  ...props
}: React.ComponentProps<typeof CommandItem>) {
  const { value, onValueChange, setSelectContent, setOpen } = useCombobox()

  return (
    <CommandItem
      {...props}
      data-slot='combobox-item'
      onSelect={(currentValue) => {
        onValueChange(currentValue)
        setSelectContent(children)
        setOpen(false)
      }}
    >
      {children}
      {value === props.value && <CheckIcon className='ml-auto' />}
    </CommandItem>
  )
}

export { Combobox, ComboboxTrigger, ComboboxContent, ComboboxItem, useCombobox }
