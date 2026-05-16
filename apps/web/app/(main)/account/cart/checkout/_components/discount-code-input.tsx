'use client'

import { useMutation } from '@tanstack/react-query'
import { formatPrice } from '@yukinu/lib/utils'
import { Button } from '@yukinu/ui/button'
import { TagIcon } from '@yukinu/ui/icons'
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from '@yukinu/ui/input-group'
import { toast } from '@yukinu/ui/toast'
import { useState } from 'react'

import { usePage } from '@/app/(main)/account/cart/checkout/page.provider'
import { useTRPC } from '@/lib/trpc'

export function DiscountCodeInput() {
  const [code, setCode] = useState('')
  const { setVoucher } = usePage()
  const { trpc } = useTRPC()

  const { mutate, isPending } = useMutation({
    ...trpc.sales.voucher.apply.mutationOptions(),
    onSuccess: ({ id, discountAmount, discountPercentage }) => {
      setVoucher({ id, discountAmount, discountPercentage })
      toast.success({
        message: 'Voucher applied!',
        description: `You got a ${discountAmount ? formatPrice(discountAmount) : `${discountPercentage}%`} discount!`,
      })
    },
    onError: ({ message }) => toast.error({ message }),
  })

  return (
    <div className='flex flex-col gap-2 sm:flex-row'>
      <InputGroup className='flex-1'>
        <InputGroupInput
          placeholder='Enter voucher or discount code'
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <InputGroupAddon>
          <TagIcon />
        </InputGroupAddon>
      </InputGroup>
      <Button
        onClick={() => mutate({ code: code.trim() })}
        disabled={code.trim().length <= 3 || isPending}
      >
        {isPending ? 'Applying...' : 'Apply'}
      </Button>
    </div>
  )
}
