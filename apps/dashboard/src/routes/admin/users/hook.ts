import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from 'nuqs'

import { UserValidators } from '@yukinu/validators/user'

const parser = {
  search: parseAsString,
  status: parseAsStringEnum([...UserValidators.statuses]).withDefault('active'),
  role: parseAsStringEnum([...UserValidators.roles]),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
}

const options = { urlKeys: { search: 'q' } }

export const useUserQueryStates = () => useQueryStates(parser, options)
