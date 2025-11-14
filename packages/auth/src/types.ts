import type { accounts, sessions } from '@yukinu/db/schema/user'
import type { usersView } from '@yukinu/db/schema/view'
import { type users } from '@yukinu/db/schema/user'

import type BaseProvider from '@/providers/base'

export interface CookieOptions {
  Domain?: string
  Expires?: Date | string | number
  HttpOnly?: boolean
  'Max-Age'?: number
  Path?: string
  SameSite?: 'Strict' | 'Lax' | 'None'
  Secure?: boolean
  [key: string]: unknown
}

export interface OAuth2Token {
  access_token: string
  token_type: string
  expires_in: number
}

export type User = typeof usersView.$inferSelect

export interface Session
  extends Omit<typeof sessions.$inferSelect, 'userId' | 'createdAt'> {
  user: User | null
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

  getAccount(
    provider: string,
    accountId: string,
  ): Promise<
    | (typeof accounts.$inferSelect & {
        status: (typeof users.$inferSelect)['status']
      })
    | null
  >

  createAccount(data: typeof accounts.$inferInsert): Promise<void>

  getSessionAndUser(token: string): Promise<Omit<Session, 'token'> | null>

  createSession(data: typeof sessions.$inferInsert): Promise<void>

  updateSession(
    token: string,
    data: Partial<typeof sessions.$inferInsert>,
  ): Promise<void>

  deleteSession(token: string): Promise<void>
}

export interface AuthOptions {
  adapter: DatabaseAdapter
  providers: Record<string, BaseProvider>
  session: {
    expiresIn: number
    expiresThreshold: number
  }
  cookieKeys: {
    token: string
    state: string
    code: string
    redirect: string
  }
  cookieOptions: CookieOptions
}
