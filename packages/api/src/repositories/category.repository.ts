import { categories } from '@yukinu/db/schema/product'

import type { ICategoryRepository } from '@/contracts/repositories/category.repository'
import { BaseRepository } from '@/repositories/base.repository'

export class CategoryRepository
  extends BaseRepository<typeof categories>
  implements ICategoryRepository
{
  protected override _table = categories
}
