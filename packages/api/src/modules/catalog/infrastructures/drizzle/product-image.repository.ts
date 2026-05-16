import type { Database } from '@yukinu/db/drizzle'

import { productImages } from '@yukinu/db/schema'
import { utapi } from '@yukinu/uploadthing'

import type { ProductImageRepository } from '@/modules/catalog/domain/repositories/product-image.repository'
import type { AbstractRepository } from '@/shared/abstracts/abstract.repository'

import { ProductImageEntity } from '@/modules/catalog/domain/entities/product-image.entity'
import { DrizzleRepository } from '@/shared/infrastructures/drizzle.repository'

export class DrizzleProductImageRepository
  extends DrizzleRepository<ProductImageEntity, typeof productImages>
  implements ProductImageRepository
{
  public constructor(db: Database) {
    super(db, productImages, 'id')
  }

  public override async delete(
    criterias: AbstractRepository.Criteria<ProductImageEntity>[],
    tx: Database = this._db,
  ): Promise<void> {
    const whereClauses = this._buildCriteria(criterias)
    const urls = await tx
      .delete(this._table)
      .where(whereClauses)
      .returning({ url: productImages.url })

    await utapi.deleteFiles(urls.map(({ url }) => url.split('/').pop() ?? ''))
  }

  protected _mapToEntity(
    row: DrizzleRepository.ExtractType<typeof productImages>,
  ): ProductImageEntity {
    return new ProductImageEntity(row)
  }
}
