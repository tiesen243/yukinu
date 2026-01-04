import type { IBaseRepository } from '@/contracts/repositories/base.repository'
import type { Database } from '@yukinu/db'
import type { products } from '@yukinu/db/schema'
import type {
  AllOutput,
  OneOutput,
  ProductSchema,
} from '@yukinu/validators/product'

export interface IProductRepository extends IBaseRepository<typeof products> {
  allWithRelations(
    criterias?: Partial<ProductSchema>[],
    orderBy?: Partial<Record<keyof ProductSchema, 'asc' | 'desc'>>,
    options?: { limit?: number; offset?: number },
    tx?: Database,
  ): Promise<AllOutput['products']>

  findWithRelations(
    id: ProductSchema['id'],
    tx?: Database,
  ): Promise<OneOutput | null>

  createAttributes(
    productId: ProductSchema['id'],
    attributes: { name: string; value: string }[],
    tx?: Database,
  ): Promise<void[]>

  deleteAttributes(
    productId: ProductSchema['id'],
    tx?: Database,
  ): Promise<unknown>
}
