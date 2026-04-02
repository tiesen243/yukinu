import { vendorStatuses } from '@yukinu/validators/vendor'
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from 'nuqs'

const parser = {
  search: parseAsString,
  status: parseAsStringEnum([...vendorStatuses]),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
}

const options = { urlKeys: { search: 'q' } }

export const useVendorQueryStates = () => useQueryStates(parser, options)
