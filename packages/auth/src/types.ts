import type { UserValidators } from '@yukinu/validators/user'

import type { BaseProvider } from '@/providers/base'

export interface User {
  id: string
  username: string
  email: string
  emailVerified: Date | null
  role: UserValidators.Role
  image: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Account {
  userId: string
  provider: string
  accountId: string
  password: string | null
}

export interface Session {
  id: string
  userId: string
  token: string
  expiresAt: Date
  ipAddress: string | null
  userAgent: string | null
}

export type SessionWithUser = Pick<
  Session,
  'token' | 'expiresAt' | 'ipAddress' | 'userAgent'
> & {
  user: Pick<User, 'id' | 'username' | 'email' | 'role' | 'image'> | null
}

export interface OAuthAccount {
  id: string
  username: string
  email: string
  image: string | null
}

export interface OAuth2Token {
  access_token: string
  token_type: string
  expires_in: number
}

export interface AuthConfig {
  providers?: BaseProvider[]
  secret?: string

  session?: {
    expiresIn?: number
    expiresThreshold?: number
  }

  keys?: {
    token?: string
    accessToken?: string
    state?: string
    codeVerifier?: string
    redirectUri?: string
  }

  cookie?: {
    Path?: string
    HttpOnly?: boolean
    Secure?: boolean
    SameSite?: 'lax' | 'strict' | 'none'
  }

  adapter: {
    user: {
      find(identifier: string): Promise<User | null>
      create(
        data: Pick<User, 'username' | 'email' | 'emailVerified' | 'image'>,
      ): Promise<Pick<User, 'id'>>
    }
    account: {
      find(
        provider: string,
        accountId: string,
      ): Promise<Pick<Account, 'userId' | 'password'> | null>
      create(data: Omit<Account, 'id'>): Promise<void>
    }
    session: {
      find(id: string): Promise<SessionWithUser | null>
      create(data: Session): Promise<void>
      update(
        token: string,
        data: Partial<Omit<Session, 'id' | 'token' | 'userId'>>,
      ): Promise<void>
      delete(id: string): Promise<void>
    }
  }
}
