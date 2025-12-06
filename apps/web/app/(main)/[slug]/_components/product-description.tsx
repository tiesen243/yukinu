import { usePage } from '@/app/(main)/[slug]/page.provider'

export const ProductDescription: React.FC = () => {
  const {
    product: { description, attributes },
  } = usePage()

  return (
    <section className='rounded-lg bg-card p-6 shadow-md dark:border'>
      <h2 className='mb-6 text-2xl font-semibold text-balance'>Overview</h2>

      <p className='mb-8 text-base text-pretty whitespace-pre-wrap'>
        {description?.split('\\n').join('\n')}
      </p>

      <h3 className='mb-6 text-2xl font-semibold text-balance'>
        Specifications
      </h3>

      <ul className='space-y-2 text-pretty capitalize'>
        {attributes.map((attr) => (
          <li key={attr.name} className='text-lg'>
            <strong>{attr.name}:</strong> {attr.value}
          </li>
        ))}
      </ul>
    </section>
  )
}
