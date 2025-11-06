import { parseAsInteger, parseAsStringLiteral, useQueryStates } from 'nuqs'

import { VendorValidator } from '@yukinu/validators/vendor'

export function useVendorTable() {
  const [query, setQuery] = useQueryStates({
    status: parseAsStringLiteral(VendorValidator.vendorStatus),
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
  })

  return { query, setQuery }
}
