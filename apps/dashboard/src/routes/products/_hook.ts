import { orderBy } from '@yukinu/validators/product'
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from 'nuqs'

const parser = {
  search: parseAsString,
  categoryId: parseAsString,
  vendorId: parseAsString,
  isDeleted: parseAsBoolean.withDefault(false),
  orderBy: parseAsStringEnum(orderBy).withDefault('createdAt_desc'),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
}

const options = { urlKeys: { search: 'q', isDeleted: 'd' } }

export const useProductQueryStates = () => useQueryStates(parser, options)
