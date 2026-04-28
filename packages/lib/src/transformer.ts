// oxlint-disable typescript/no-explicit-any

type DataType =
  | 'undefined'
  | 'BigInt'
  | 'Date'
  | 'RegExp'
  | 'Set'
  | 'Map'
  | 'Error'
  | 'URL'
type Metadata = Record<string, DataType>

function getDeep(obj: any, path: string) {
  const keys = path.split('.')
  let current = obj
  for (const key of keys) current = current[key]
  return current
}

function setDeep(obj: any, path: string, value: any) {
  const keys = path.split('.')
  let current = obj
  for (let i = 0; i < keys.length - 1; i += 1)
    current = current[keys.at(i) ?? 0]
  current[keys.at(-1) ?? 0] = value
}

function serializeValue(value: any, path: string, meta: Metadata): any {
  if (value === undefined) {
    meta[path] = 'undefined'
    return null
  } else if (typeof value === 'bigint') {
    meta[path] = 'BigInt'
    return value.toString()
  } else if (value instanceof Date) {
    meta[path] = 'Date'
    return value.getTime()
  } else if (value instanceof RegExp) {
    meta[path] = 'RegExp'
    return { source: value.source, flags: value.flags }
  } else if (value instanceof URL) {
    meta[path] = 'URL'
    return value.href
  } else if (value instanceof Error) {
    meta[path] = 'Error'
    return { name: value.name, message: value.message, stack: value.stack }
  } else if (value instanceof Set) {
    meta[path] = 'Set'
    return Array.from(value, (v, i) =>
      serializeValue(v, path ? `${path}.${i}` : `${i}`, meta),
    )
  } else if (value instanceof Map) {
    meta[path] = 'Map'
    return Array.from(value.entries(), ([k, v], i) => [
      serializeValue(k, path ? `${path}.${i}.0` : `${i}.0`, meta),
      serializeValue(v, path ? `${path}.${i}.1` : `${i}.1`, meta),
    ])
  } else if (Array.isArray(value)) {
    return value.map((v, i) =>
      serializeValue(v, path ? `${path}.${i}` : `${i}`, meta),
    )
  } else if (value !== null && typeof value === 'object') {
    const result: any = {}
    for (const key in value) {
      if (Object.hasOwn(value, key)) {
        result[key] = serializeValue(
          value[key],
          path ? `${path}.${key}` : key,
          meta,
        )
      }
    }

    return result
  }

  return value
}

export const transformer = {
  serialize: (obj: any) => {
    const meta: Metadata = {}
    const data = serializeValue(obj, '', meta)
    return { data, meta }
  },

  deserialize: (obj: any) => {
    if (!obj || typeof obj !== 'object' || !obj.meta) return obj

    const { data, meta } = obj
    const sortedPaths = Object.keys(meta).toSorted(
      (a, b) => a.length - b.length,
    )

    for (const path of sortedPaths) {
      const type = meta[path]
      const rawValue = getDeep(data, path)
      let value: any
      switch (type) {
        case 'undefined':
          value = undefined
          break
        case 'BigInt':
          value = BigInt(rawValue)
          break
        case 'Date':
          value = new Date(rawValue)
          break
        case 'RegExp':
          value = new RegExp(rawValue.source, rawValue.flags)
          break
        case 'URL':
          value = new URL(rawValue)
          break
        case 'Error':
          value = new Error(rawValue.message)
          value.name = rawValue.name
          value.stack = rawValue.stack
          break
        case 'Set':
          value = new Set(rawValue)
          break
        case 'Map':
          value = new Map(rawValue)
          break
        default:
          value = rawValue
      }
      if (path === '') return value
      setDeep(data, path, value)
    }

    return data
  },
}
