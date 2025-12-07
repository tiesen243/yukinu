import { usePage } from '@/app/(main)/[slug]/page.provider'

export const ProductDescription: React.FC = () => {
  const {
    product: { description, attributes },
  } = usePage()

  return (
    <article className='flex flex-col gap-6 rounded-lg bg-card p-6 shadow-md dark:border'>
      <h2 className='text-2xl font-semibold text-balance'>Overview</h2>
      <p className='overflow-x-auto text-base text-pretty whitespace-pre-wrap'>
        {description?.split('\\n').join('\n')}
      </p>

      <section className='flex flex-col gap-4'>
        <h3 className='text-xl font-semibold text-balance'>Specifications</h3>
        <ul className='flex flex-col gap-2 text-pretty capitalize'>
          {attributes.map((attr) => (
            <li key={attr.name}>
              <strong>{attr.name}:</strong> {attr.value}
            </li>
          ))}
        </ul>
      </section>
    </article>
  )
}
