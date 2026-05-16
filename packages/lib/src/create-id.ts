// oxlint-disable no-bitwise

const createRandom = () => {
  if (
    typeof globalThis !== 'undefined' &&
    typeof globalThis.crypto.getRandomValues === 'function'
  ) {
    return () => {
      const buffer = new Uint32Array(1)
      globalThis.crypto.getRandomValues(buffer)
      return (buffer[0] ?? 0) / 0x1_00_00_00_00
    }
  }

  return Math.random
}

const random = createRandom()

const createEntropy = (length = 4, rand = random) => {
  let entropy = ''

  while (entropy.length < length)
    entropy += Math.floor(rand() * 36).toString(36)

  return entropy
}

function hash(input: string, length = 24): string {
  let _hash = ''
  const seed = 2_166_136_261

  for (let i = 0; _hash.length < length; i += 1) {
    let h = seed

    for (let j = 0; j < input.length; j += 1) {
      h ^= (input.codePointAt(j) ?? 0) + i
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24)
    }

    // oxlint-disable-next-line unicorn/prefer-math-trunc
    _hash += (h >>> 0).toString(36) ?? ''
    // oxlint-disable-next-line no-param-reassign
    input = _hash
  }

  return _hash.slice(0, length)
}

const createFingerprint = ({
  globalObj = globalThis,
  random: rand = random,
}) => {
  const globals = Object.keys(globalObj).toString()
  const sourceString =
    globals.length > 0
      ? globals + createEntropy(32, rand)
      : createEntropy(32, rand)

  return hash(sourceString).slice(0, 32)
}

// oxlint-disable-next-line no-param-reassign, no-plusplus
const createCounter = (count: number) => () => count++

const createRandomLetter = (rand = random) =>
  String.fromCodePoint(97 + Math.floor(rand() * 26))

export function createId(rand = random): string {
  const time = Date.now().toString(36)
  const count = createCounter(Math.floor(rand() * 476_782_367))().toString(36)
  const fingerprint = createFingerprint({ random: rand })

  const salt = createEntropy(24, rand)
  const hashInput = `${time}${salt}${count}${fingerprint}`

  const letter = createRandomLetter(rand)
  return `${letter}${hash(hashInput).slice(1, 24)}`
}
