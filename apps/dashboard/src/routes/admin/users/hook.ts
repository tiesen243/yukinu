import { userRoleEnum } from '@yukinu/db/schema'
import {
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  useQueryStates,
} from 'nuqs'

const parser = {
  search: parseAsString.withDefault(''),
  role: parseAsStringEnum(userRoleEnum.enumValues),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
}

const options = { urlKeys: { search: 'q' } }

export const useUserQueryStates = () => useQueryStates(parser, options)
