import { cn } from '@yukinu/ui'
import * as CardPrimitive from '@yukinu/ui/card'
import * as React from 'react'
import { View } from 'react-native'

import { Text, TextProvider } from '@/components/ui/text'

function Card({
  className,
  ...props
}: React.ComponentProps<typeof CardPrimitive.Card>) {
  return (
    <TextProvider className='text-card-foreground'>
      <CardPrimitive.Card
        className={cn('border border-foreground/10', className)}
        render={<View />}
        {...props}
      />
    </TextProvider>
  )
}

function CardHeader({
  ...props
}: React.ComponentProps<typeof CardPrimitive.CardHeader>) {
  return <CardPrimitive.CardHeader render={<View />} {...props} />
}

function CardTitle({
  ...props
}: React.ComponentProps<typeof CardPrimitive.CardTitle>) {
  return <CardPrimitive.CardTitle render={<Text />} {...props} />
}

function CardDescription({
  ...props
}: React.ComponentProps<typeof CardPrimitive.CardDescription>) {
  return <CardPrimitive.CardDescription render={<Text />} {...props} />
}

function CardContent({
  ...props
}: React.ComponentProps<typeof CardPrimitive.CardContent>) {
  return <CardPrimitive.CardContent render={<View />} {...props} />
}

function CardFooter({
  ...props
}: React.ComponentProps<typeof CardPrimitive.CardFooter>) {
  return <CardPrimitive.CardFooter render={<View />} {...props} />
}

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
