import { TRPCError } from '@trpc/server'

import type { Database } from '@yukinu/db'
import type { ProductModels } from '@yukinu/validators/product'

import type { IProductService } from '@/contracts/services/product.service'
import type {
  ICategoryRepository,
  IProductRepository,
  IVendorRepository,
} from '@/types'

export class ProductService implements IProductService {
  constructor(
    private readonly _db: Database,
    private readonly _category: ICategoryRepository,
    private readonly _product: IProductRepository,
    private readonly _vendor: IVendorRepository,
  ) {}

  public async all(
    input: ProductModels.AllInput,
  ): Promise<ProductModels.AllOutput> {
    const { search, page, limit } = input
    const offset = (page - 1) * limit

    const products = await this._product.findAllView(search, limit, offset)

    const totalItems = await this._product.countAllView(search)
    const totalPages = Math.ceil(totalItems / limit)

    return {
      products,
      pagination: { page, totalPages, totalItems },
    }
  }

  public async create(
    input: ProductModels.CreateInput,
  ): Promise<ProductModels.CreateOutput> {
    const [vendor, category] = await Promise.all([
      this._vendor.find(input.vendorId),
      this._category.find(input.categoryId),
    ])
    if (!vendor || !category) throw new TRPCError({ code: 'NOT_FOUND' })

    return this._db.transaction(async (tx) => {
      const product = await this._product.create(
        {
          ...input,
          price: String(input.price),
          code: this._generateProductCode(input.name),
        },
        tx,
      )

      if (input.images.length > 0)
        await this._product.createImages(
          input.images.map((image) => ({
            url: image.url,
            alt: image.alt,
            productId: product.id,
          })),
          tx,
        )

      if (input.variantGroups.length > 0)
        await this._product.createVariants(
          input.variantGroups.map((group) => ({
            code: group.name.charAt(0).toUpperCase(),
            name: group.name,
            productId: product.id,
            variants: group.variants.map((variant) => ({
              code: variant.name.charAt(0).toUpperCase(),
              name: variant.name,
              extraPrice: String(variant.extraPrice),
            })),
          })),
          tx,
        )

      return { productId: product.id }
    })
  }

  private _generateProductCode(productName: string): string {
    const namePart = productName
      .replace(/[^a-zA-Z]/g, '')
      .substring(0, 2)
      .toUpperCase()
    const timestampPart = String(Date.now()).slice(-3)
    return `${namePart}${timestampPart}`
  }
}
