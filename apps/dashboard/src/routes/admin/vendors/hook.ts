import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from 'nuqs'

import { VendorValidators } from '@yukinu/validators/vendor'

const parser = {
  search: parseAsString.withDefault(''),
  status: parseAsStringEnum([...VendorValidators.statuses]),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
}

const options = { urlKeys: { search: 'q' } }

export const useVendorQueryStates = () => useQueryStates(parser, options)
