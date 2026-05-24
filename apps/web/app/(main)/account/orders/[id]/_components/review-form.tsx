import type { OneOrderDto } from '@yukinu/api/checkout'

import { CreateReviewDto } from '@yukinu/api/catalog'
import { Button } from '@yukinu/ui/button'
import {
  FieldSet,
  FieldLegend,
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { StarIcon } from '@yukinu/ui/icons'
import { RadioGroup, RadioGroupItem } from '@yukinu/ui/radio-group'
import { Textarea } from '@yukinu/ui/textarea'
import { toast } from '@yukinu/ui/toast'
import Image from 'next/image'

import { useTRPC } from '@/lib/trpc'

export const ReviewItemForm: React.FC<{
  orderId: number
  item: OneOrderDto.Output['items'][number]
}> = ({ orderId, item }) => {
  const { trpcClient, trpc, queryClient } = useTRPC()

  const form = useForm({
    defaultValues: {
      productId: item.productId as string,
      rating: 0,
      comment: '',
    },
    schema: CreateReviewDto.input,
    onSubmit: trpcClient.catalog.product.createReview.mutate,
    onSuccess: () => {
      queryClient.invalidateQueries(
        trpc.checkout.order.one.queryFilter({ id: orderId }),
      )
      toast.success({ message: 'Review submitted successfully' })
    },
    onError: ({ message }) => toast.error({ message }),
  })

  return (
    <form id={form.formId} onSubmit={form.handleSubmit}>
      <FieldSet disabled={form.state.isPending}>
        <FieldLegend className='flex flex-row items-center gap-2'>
          <div className='relative size-8 rounded-lg bg-secondary'>
            <Image
              src={item.productImage ?? '/assets/logo.svg'}
              alt={item.productName}
              className='object-cover p-1'
              fill
            />
          </div>

          <span>Review for {item.productName}</span>
        </FieldLegend>

        <FieldGroup>
          <form.Field
            name='rating'
            render={({ field, meta }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel>Rating</FieldLabel>

                <RadioGroup
                  className='flex flex-row'
                  value={String(field.value)}
                  onValueChange={(value) => field.onChange(Number(value))}
                  aria-describedby={field['aria-describedby']}
                >
                  {Array.from({ length: 5 }, (_, i) => i + 1).map((rating) => (
                    <FieldLabel key={rating} className='cursor-pointer'>
                      <StarIcon
                        className={
                          rating <= field.value
                            ? 'fill-warning stroke-warning'
                            : 'fill-transparent stroke-muted-foreground'
                        }
                      />

                      <RadioGroupItem value={String(rating)} hidden />
                    </FieldLabel>
                  ))}
                </RadioGroup>

                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <form.Field
            name='comment'
            render={({ field, meta }) => (
              <Field data-invalid={meta.errors.length > 0}>
                <FieldLabel>Comment</FieldLabel>
                <Textarea {...field} placeholder='Write your review here...' />
                <FieldError id={meta.errorId} errors={meta.errors} />
              </Field>
            )}
          />

          <Field>
            <Button type='submit' disabled={form.state.isPending}>
              Submit Review
            </Button>
          </Field>
        </FieldGroup>
      </FieldSet>
    </form>
  )
}
