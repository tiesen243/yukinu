import { ProductValidators } from '@yukinu/validators/product'
import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs/server'

export const productsParsers = {
  search: parseAsString,
  categoryId: parseAsString,
  vendorId: parseAsString,
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(8),
  orderBy: parseAsStringEnum(ProductValidators.orderBy).withDefault(
    'createdAt_desc',
  ),
}

export const productsOptions = {
  urlKeys: {
    search: 'q',
    categoryId: 'c',
    vendorId: 'v',
  },
}

export const productsCache = createSearchParamsCache(
  productsParsers,
  productsOptions,
)
