import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from 'nuqs'

const parser = {
  search: parseAsString,
  categoryId: parseAsString,
  vendorId: parseAsString,
  status: parseAsStringEnum(['active', 'inactive']).withDefault('active'),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
}

const options = { urlKeys: { search: 'q' } }

export const useProductQueryStates = () => useQueryStates(parser, options)
