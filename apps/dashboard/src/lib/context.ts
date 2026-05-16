import type { User } from '@yukinu/auth'

import { createContext } from 'react-router'

export const userContext = createContext<User | null>(null)
