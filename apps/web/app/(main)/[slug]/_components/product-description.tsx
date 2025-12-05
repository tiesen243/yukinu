import { usePage } from '@/app/(main)/[slug]/page.provider'

export const ProductDescription: React.FC = () => {
  const {
    product: { description, attributes },
  } = usePage()

  return (
    <section className='rounded-lg bg-card p-6 shadow-md'>
      <h3 className='mb-4 text-2xl font-semibold'>Description</h3>

      <p className='text-base text-pretty whitespace-pre-wrap'>
        {description?.split('\\n').join('\n')}
      </p>

      <h3 className='mt-6 mb-4 text-2xl font-semibold'>Attributes</h3>
      <ul className='capitalize'>
        {attributes.map((attr) => (
          <li key={attr.name} className='text-lg'>
            <strong>{attr.name}:</strong> {attr.value}
          </li>
        ))}
      </ul>
    </section>
  )
}
