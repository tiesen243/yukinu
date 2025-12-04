import { parseAsInteger, parseAsString, useQueryStates } from 'nuqs'

const parser = {
  search: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(10),
}

const options = { urlKeys: { search: 'q' } }

export const useCategoryQueryStates = () => useQueryStates(parser, options)
