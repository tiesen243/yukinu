/* eslint-disable @eslint-react/no-array-index-key */
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'

import { Button } from '@yukinu/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@yukinu/ui/field'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { MinusIcon, TriangleAlertIcon } from '@yukinu/ui/icons'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@yukinu/ui/input-group'
import { toast } from '@yukinu/ui/sonner'
import { ProductValidators } from '@yukinu/validators/product'

import type { Route } from './+types/_index'
import { useTRPC } from '@/lib/trpc/react'

export default function CreateProductVariantsPage({
  params,
}: Route.ComponentProps) {
  const trpc = useTRPC()
  const navigate = useNavigate()

  const { mutateAsync } = useMutation({
    ...trpc.product.reciateVariant.mutationOptions(),
    meta: { filter: trpc.product.one.queryFilter({ id: params.id }) },
    onSuccess: () => toast.success('Successfully reciated variants'),
    onError: ({ message }) =>
      toast.error('Failed to reciate variants', { description: message }),
  })

  const form = useForm({
    defaultValues: {
      id: params.id,
      variants: [{ name: '', options: [] }],
    } as Omit<ProductValidators.ReciateVariantInput, 'vendorId'>,
    schema: ProductValidators.reciateVariantInput.omit({ vendorId: true }),
    onSubmit: mutateAsync,
    onSuccess: () => void navigate(`/products/${params.id}`),
  })

  return (
    <>
      <h1 className='sr-only'>Reciate Product Variants page</h1>

      <form
        onSubmit={form.handleSubmit}
        className='rounded-lg bg-card p-6 text-card-foreground shadow-sm dark:border'
      >
        <FieldSet>
          <FieldLegend>Reciate Product Variants</FieldLegend>
          <FieldDescription className='flex items-center gap-2 text-warning'>
            <TriangleAlertIcon size={16} /> This action will delete all existing
            variants and create new ones.
          </FieldDescription>

          <form.Field
            name='variants'
            render={({ meta, field }) => (
              <FieldGroup>
                {field.value.map((variant, vIndex) => (
                  <FieldGroup key={`variant-${vIndex}`}>
                    <Field>
                      <FieldLabel>Variant Name</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          value={variant.name}
                          onChange={(e) => {
                            const newVariants = [...field.value]
                            if (!newVariants[vIndex]) return
                            newVariants[vIndex].name = e.target.value
                            field.onChange(newVariants)
                          }}
                          placeholder='e.g., Size'
                          aria-label='Variant Name'
                          aria-describedby={field['aria-describedby']}
                          aria-invalid={field['aria-invalid']}
                        />
                        <InputGroupAddon align='inline-end'>
                          <InputGroupButton
                            onClick={() => {
                              field.onChange(
                                field.value.filter((_, i) => i !== vIndex),
                              )
                            }}
                          >
                            <MinusIcon />
                            <span className='sr-only'>Remove Variant</span>
                          </InputGroupButton>
                        </InputGroupAddon>
                      </InputGroup>
                    </Field>

                    <FieldGroup>
                      <FieldLabel>Options</FieldLabel>
                      {variant.options.map((option, oIndex) => (
                        <Field key={`variant-${vIndex}-option-${oIndex}`}>
                          <InputGroup>
                            <InputGroupInput
                              value={option}
                              onChange={(e) => {
                                const newVariants = [...field.value]
                                if (!newVariants[vIndex]) return
                                newVariants[vIndex].options[oIndex] =
                                  e.target.value
                                field.onChange(newVariants)
                              }}
                              placeholder='e.g., s, m, l'
                              aria-label='Variant Option'
                              aria-describedby={field['aria-describedby']}
                              aria-invalid={field['aria-invalid']}
                            />
                            <InputGroupAddon align='inline-end'>
                              <InputGroupButton
                                onClick={() => {
                                  const newVariants = [...field.value]
                                  if (!newVariants[vIndex]) return
                                  newVariants[vIndex].options = newVariants[
                                    vIndex
                                  ].options.filter((_, i) => i !== oIndex)
                                  field.onChange(newVariants)
                                }}
                              >
                                <MinusIcon />
                                <span className='sr-only'>Remove Option</span>
                              </InputGroupButton>
                            </InputGroupAddon>
                          </InputGroup>
                          <FieldError />
                        </Field>
                      ))}
                    </FieldGroup>

                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => {
                        field.onChange(
                          field.value.map((v, i) =>
                            i === vIndex
                              ? { ...v, options: [...v.options, ''] }
                              : v,
                          ),
                        )
                      }}
                    >
                      Add Option
                    </Button>

                    <FieldSeparator />
                  </FieldGroup>
                ))}

                <Field>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => {
                      field.onChange([
                        ...field.value,
                        { name: '', options: [''] },
                      ])
                    }}
                  >
                    Add Variant
                  </Button>
                </Field>

                <FieldError id={meta.errorId} errors={meta.errors} />
              </FieldGroup>
            )}
          />

          <Field>
            <Button type='submit' disabled={form.state.isPending}>
              {form.state.isPending ? 'Reciating...' : 'Reciate Variants'}
            </Button>
          </Field>
        </FieldSet>
      </form>
    </>
  )
}
