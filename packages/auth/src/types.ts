import type * as UserTypes from '@yukinu/db/schema/user'
import type * as ViewTypes from '@yukinu/db/schema/view'

import type BaseProvider from '@/providers/base'

export interface CookieOptions {
  domain?: string
  expires?: Date | string | number
  httpOnly?: boolean
  maxAge?: number
  path?: string
  sameSite?: 'Strict' | 'Lax' | 'None'
  secure?: boolean
  [key: string]: unknown
}

export interface OAuth2Token {
  access_token: string
  token_type: string
  expires_in: number
}

export interface User extends ViewTypes.UserView {
  id: string
}

export interface Account extends UserTypes.Account {
  id: string
  status: UserTypes.User['status']
}

export interface NewAccount extends UserTypes.NewAccount {
  userId: string
}

export interface Session
  extends Omit<UserTypes.Session, 'userId' | 'createdAt'> {
  user: User | null
}

export interface NewSession extends UserTypes.NewSession {
  token: string
}

export interface OauthAccount {
  accountId: string
  email: string
  name: string
  image: string
}

export interface DatabaseAdapter {
  getUserByIndentifier(
    indentifier: string,
  ): Promise<Pick<User, 'id' | 'status'> | null>
  createUser(data: Omit<OauthAccount, 'accountId'>): Promise<User['id'] | null>

  getAccount(provider: string, accountId: string): Promise<Account | null>
  createAccount(data: NewAccount): Promise<void>

  getSessionAndUser(token: string): Promise<Omit<Session, 'token'> | null>
  createSession(data: NewSession): Promise<void>
  updateSession(token: string, data: Partial<NewSession>): Promise<void>
  deleteSession(token: string): Promise<void>
  deleteSessionsByUserId(userId: string): Promise<void>
}

export interface AuthOptions {
  adapter: DatabaseAdapter
  providers: Record<string, BaseProvider>
  session: {
    expiresIn: number
    expiresThreshold: number
  }
  cookieKeys?: {
    token?: string
    state?: string
    code?: string
    redirect?: string
  }
  cookieOptions?: CookieOptions
}
