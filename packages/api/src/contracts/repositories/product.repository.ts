import type { IBaseRepository } from '@/contracts/repositories/base.repository'
import type { Database } from '@yukinu/db'
import type { products } from '@yukinu/db/schema'
import type {
  AllOutput,
  OneOutput,
  ProductSchema,
  ProductVariantSchema,
} from '@yukinu/validators/product'
import type { VendorSchema } from '@yukinu/validators/vendor'

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

  findVariant(
    productVariantId: ProductVariantSchema['id'],
    vendorId?: VendorSchema['id'],
    tx?: Database,
  ): Promise<Pick<ProductVariantSchema, 'id'> | null>

  updateVariant(
    id: ProductVariantSchema['id'],
    data: Partial<ProductVariantSchema>,
    tx?: Database,
  ): Promise<ProductVariantSchema['id']>

  deleteVariant(
    variantId: ProductVariantSchema['id'],
    tx?: Database,
  ): Promise<unknown>

  deleteVariants(
    productId: ProductSchema['id'],
    tx?: Database,
  ): Promise<unknown>
}
