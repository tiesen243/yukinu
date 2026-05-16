import { RecreateVariantDto } from '@yukinu/api/catalog'
import { Button } from '@yukinu/ui/button'
import { Card } from '@yukinu/ui/card'
import { useForm } from '@yukinu/ui/hooks/use-form'
import { toast } from '@yukinu/ui/toast'
import { Typography } from '@yukinu/ui/typography'
import { useNavigate } from 'react-router'

import { useTRPC } from '@/lib/trpc'
import { ProductVariantsFields } from '@/routes/(catalog)/products/_components/save-product-form'

import type { Route } from './+types/[id].variant'

export default function CatalogProductsIDVariantPage({
  params,
}: Route.ComponentProps) {
  const { trpcClient, trpc, queryClient } = useTRPC()
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      id: params.id,
      variants: [],
    },
    schema: RecreateVariantDto.input.omit({ vendorId: true }),
    onSubmit: trpcClient.catalog.variant.recreate.mutate,
    onSuccess: () => [
      toast.success({ message: 'Variants recreated successfully' }),
      queryClient.invalidateQueries(
        trpc.catalog.product.one.queryFilter({ id: params.id }),
      ),
      navigate(`/catalog/products/${params.id}`),
    ],
    onError: toast.error,
  })

  return (
    <>
      <Typography variant='h2'>Edit Product Variant</Typography>
      <Typography className='text-muted-foreground'>
        Edit the details of the product variant below. You can update the SKU,
        options, price, and stock information to keep your catalog organized and
        up-to-date.
      </Typography>

      <Card
        className='mt-4 px-4'
        render={<form id={form.formId} onSubmit={form.handleSubmit} />}
      >
        <ProductVariantsFields form={form as never} />

        <Button type='submit'>Recreate Variants</Button>
      </Card>
    </>
  )
}
