import { AllProductsDto } from '@yukinu/api/catalog'
import {
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from 'nuqs'

const parser = {
  search: parseAsString.withDefault(''),
  categoryId: parseAsString,
  isDeleted: parseAsBoolean.withDefault(false),
  orderBy: parseAsStringEnum(AllProductsDto.orderBy).withDefault(
    'createdAt_desc',
  ),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
}

const options = { urlKeys: { search: 'q', isDeleted: 'd' } }

export const useProductQueryStates = () => useQueryStates(parser, options)
