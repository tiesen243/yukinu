import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from 'nuqs'

import { ProductValidators } from '@yukinu/validators/product'

const parser = {
  search: parseAsString,
  categoryId: parseAsString,
  vendorId: parseAsString,
  status: parseAsStringEnum(['active', 'inactive']).withDefault('active'),
  orderBy: parseAsStringEnum(ProductValidators.orderBy).withDefault(
    'createdAt_asc',
  ),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
}

const options = { urlKeys: { search: 'q' } }

export const useProductQueryStates = () => useQueryStates(parser, options)
