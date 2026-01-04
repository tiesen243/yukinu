import type { IProductImageRepository } from '@/contracts/repositories/product-image.repository'
import type { Database, orm as ORM } from '@yukinu/db'
import type * as Schema from '@yukinu/db/schema'
import type { ProductImageSchema } from '@yukinu/validators/product'

import { BaseRepository } from '@/repositories/base.repository'

export class ProductImageRepository
  extends BaseRepository<typeof Schema.productImages>
  implements IProductImageRepository
{
  constructor(db: Database, orm: typeof ORM, schema: typeof Schema) {
    super(db, orm, schema, schema.productImages)
  }

  override async deleteMany(
    criterias: Partial<ProductImageSchema>[],
    tx?: Database,
  ): Promise<ProductImageSchema['url'][]> {
    const whereClause = this._buildCriteria(criterias)

    const result = await (tx ?? this._db)
      .delete(this._table)
      .where(whereClause)
      .returning({ url: this._table.url })

    return result.length <= 0 ? result.map((row) => row.url) : []
  }
}
