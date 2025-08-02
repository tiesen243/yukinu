import { useNavigate } from 'react-router'

import { Button } from '@yuki/ui/button'
import { useForm } from '@yuki/ui/form'
import { Input } from '@yuki/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@yuki/ui/select'
import { toast } from '@yuki/ui/sonner'
import { Textarea } from '@yuki/ui/textarea'
import { UploadButton } from '@yuki/ui/upload-button'
import { createProductSchema } from '@yuki/validators/product'

import { useTRPC } from '@/trpc/react'

export const CreateProductForm: React.FC<{
  categories: { id: string; name: string }[]
}> = ({ categories }) => {
  const { trpc, trpcClient, queryClient } = useTRPC()
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
      image: '/assets/logo.svg',
      stock: 0,
      price: 0,
      categoryId: '',
    },
    validator: createProductSchema,
    onSubmit: trpcClient.seller.product.create.mutate,
    onSuccess: async () => {
      await queryClient.invalidateQueries(
        trpc.seller.product.all.queryOptions({ isCurrentUser: true }),
      )
      toast.success('Product created successfully!')
      await navigate('/products')
    },
    onError: ({ message }) => {
      toast.error(message)
    },
  })

  return (
    <form
      className='grid grid-cols-2 gap-4'
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
    >
      {fields.map(({ multiline, ...f }) => (
        <form.Field
          key={f.name}
          name={f.name}
          render={({ field, meta }) => (
            <div
              id={meta.id}
              className={`grid gap-2 ${f.type !== 'number' ? 'col-span-2' : ''}`}
            >
              <form.Label>{f.label}</form.Label>
              <form.Control {...field}>
                {multiline ? <Textarea {...f} /> : <Input {...f} />}
              </form.Control>
              <form.Message />
            </div>
          )}
        />
      ))}

      <form.Field
        name='categoryId'
        render={({ field, meta }) => (
          <div id={meta.id} className='col-span-2 grid gap-2'>
            <form.Label>Category</form.Label>
            <Select value={field.value} onValueChange={field.onChange}>
              <form.Control onBlur={field.onBlur}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select a category' />
                </SelectTrigger>
              </form.Control>

              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <form.Message />
          </div>
        )}
      />

      <form.Field
        name='image'
        render={({ field, meta }) => (
          <div
            id={meta.id}
            className='col-span-2 flex flex-col items-center gap-2'
          >
            <img
              src={field.value}
              alt='Product preview'
              className='size-40 rounded-lg border-2 object-cover shadow-sm'
            />

            <UploadButton
              endpoint='productUploader'
              onClientUploadComplete={(res) => {
                if (res[0]) field.onChange(res[0].ufsUrl)
              }}
            />

            <form.Message />
          </div>
        )}
      />

      <Button disabled={form.state.isPending} className='col-span-2'>
        Create Product
      </Button>
    </form>
  )
}

const fields = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Enter product name',
    multiline: false,
  },
  {
    name: 'description',
    label: 'Description',
    type: 'textarea',
    placeholder: 'Enter product description',
    multiline: true,
  },
  {
    name: 'stock',
    label: 'Stock',
    type: 'number',
    placeholder: 'Enter stock quantity',
    multiline: false,
  },
  {
    name: 'price',
    label: 'Price',
    type: 'number',
    placeholder: 'Enter product price',
    multiline: false,
  },
] as const
