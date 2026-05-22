import { Typography } from '@yukinu/ui/typography'

import { SaveCategoryForm } from '@/routes/catalog/categories/_components/save-category-form'

export default function CatalogCategoriesNewPage() {
  return (
    <>
      <Typography variant='h2'>Create New Category</Typography>
      <Typography className='text-muted-foreground'>
        Create a new category to organize your products effectively. Fill in the
        details below to add a new category to your catalog.
      </Typography>

      <SaveCategoryForm />
    </>
  )
}
