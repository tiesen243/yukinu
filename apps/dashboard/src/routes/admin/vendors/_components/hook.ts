import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from 'nuqs'

const parser = {
  search: parseAsString.withDefault(''),
  status: parseAsStringEnum(['pending', 'approved', 'rejected', 'suspended']),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
}

const options = { urlKeys: { search: 'q' } }

export const useVendorQueryStates = () => useQueryStates(parser, options)
