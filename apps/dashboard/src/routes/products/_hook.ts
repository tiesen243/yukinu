import {
  parseAsBoolean,
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
  isDeleted: parseAsBoolean.withDefault(false),
  orderBy: parseAsStringEnum(ProductValidators.orderBy).withDefault(
    'createdAt_desc',
  ),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
}

const options = { urlKeys: { search: 'q', isDeleted: 'd' } }

export const useProductQueryStates = () => useQueryStates(parser, options)
