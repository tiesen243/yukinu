import type { SearchParams } from 'nuqs/server'
import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs/server'

export interface Props {
  searchParams: Promise<SearchParams>
}

export const searchParsers = {
  query: parseAsString.withDefault(''),
  page: parseAsInteger.withDefault(1),
  limit: parseAsInteger.withDefault(12),
  sort: parseAsStringEnum([
    'name',
    'price',
    'createdAt',
    'updatedAt',
  ]).withDefault('createdAt'),
  order: parseAsStringEnum(['asc', 'desc']).withDefault('desc'),
  category: parseAsString.withDefault(''),
}

export const cacheSearch = createSearchParamsCache(searchParsers, {
  urlKeys: {
    query: 'q',
  },
})
