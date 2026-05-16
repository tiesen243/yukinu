import type { userRoleEnum } from '@yukinu/db/schema'

import type { BaseProvider } from '@/core/providers/base'

export type Awaitable<T> = T | PromiseLike<T>

export type Role = (typeof userRoleEnum)['enumValues'][number]

export interface User {
  id: string
  username: string
  email: string
  image: string | null
  role: Role

  createdAt: Date
  updatedAt: Date
  emailVerified: Date | null
}

export interface Account {
  userId: string

  provider: string
  providerAccountId: string

  password: string | null
}

export interface Session {
  id: string
  userId: string

  token: string
  ipAddress: string | null
  userAgent: string | null
  expiresAt: Date
}

export interface SessionWithUser {
  token: string | null
  user: User | null
  expiresAt: Date
}

export interface OAuth2Token {
  access_token: string
  token_type: string
  expires_in: number
}

export interface OAuthAccount {
  id: string
  username: string
  email: string
  image: string | null
}

export interface AuthAdapter {
  createUser(
    user: Pick<User, 'username' | 'email' | 'image'>,
  ): Awaitable<Pick<User, 'id'>>
  getUser: (id: string) => Awaitable<User | null>
  getUserByEmail: (email: string) => Awaitable<User | null>
  getUserByAccount: (
    account: Pick<Account, 'provider' | 'providerAccountId'>,
  ) => Awaitable<(Pick<User, 'id'> & Pick<Account, 'password'>) | null>
  getUserByIdentity: (
    identity: Pick<User, 'username' | 'email'>,
  ) => Awaitable<
    (Pick<User, 'id' | 'emailVerified'> & Pick<Account, 'password'>) | null
  >
  updateUser: (
    user: Partial<User> & Pick<User, 'id'>,
  ) => Awaitable<Pick<User, 'id'> | null>
  deleteUser: (id: string) => Awaitable<void>

  createSession: (session: Session) => Awaitable<Pick<Session, 'id'>>
  getSessionWithUser: (
    id: string,
  ) => Awaitable<{ session: Omit<Session, 'userId'>; user: User } | null>
  updateSession: (
    session: Partial<Session> & Pick<Session, 'id'>,
  ) => Awaitable<Pick<Session, 'id'> | null>
  deleteSession: (id: string) => Awaitable<void>

  getAccount: (
    provider: Account['provider'],
    providerAccountId: Account['providerAccountId'],
  ) => Awaitable<Account | null>
  createAccount: (account: Account) => Awaitable<void>
}

export interface AuthConfig {
  secret: string

  adapter: AuthAdapter
  providers: BaseProvider[]

  session: {
    expiresIn: number
    expiresThreshold: number
    accessTokenExpiresIn: number
  }

  cookies: {
    keys: {
      accessToken: string
      refreshToken: string
      state: string
      codeVerifier: string
      redirectUri: string
    }

    options: {
      Path: string
      HttpOnly: boolean
      Secure: boolean
      SameSite: 'Lax' | 'Strict' | 'None'

      Domain?: string
      Expires?: Date | string
      'Max-Age'?: number
    }
  }
}

export interface LoginInput {
  identifier: string
  password: string
}

export interface LoginOutput {
  accessToken: string
  refreshToken: string
}
