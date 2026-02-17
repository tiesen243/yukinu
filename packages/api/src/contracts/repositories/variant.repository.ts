import type { Database } from '@yukinu/db'
import type { variants } from '@yukinu/db/schema'
import type { CreateInput, ProductSchema } from '@yukinu/validators/product'

import type { IBaseRepository } from '@/contracts/repositories/base.repository'

export interface IVariantRepository extends IBaseRepository<typeof variants> {
  createWithOptions(
    productId: ProductSchema['id'],
    variants: CreateInput['variants'],
    tx?: Database,
  ): Promise<ProductSchema['id']>
}
