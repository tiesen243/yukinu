import type { categories } from '@yukinu/db/schema/product'

import type { ICategoryRepository } from '@/contracts/repositories/category.repository'
import { BaseRepository } from '@/repositories/base.repository.mock'

export class CategoryRepository
  extends BaseRepository<typeof categories>
  implements ICategoryRepository
{
  protected override _data = [
    { id: 'category-1', name: 'Category 1' },
    { id: 'category-2', name: 'Category 2' },
    { id: 'category-3', name: 'Category 3' },
  ]
}
