import type { Session } from '@yukinu/auth'
import type { UserValidator } from '@yukinu/validators/user'

import type { IAuthService } from '@/contracts/services/auth.service'
import type { IUserService } from '@/contracts/services/user.service'

export interface TRPCMeta {
  message?: string
  roles?: UserValidator.Role[]
}

export interface TRPCContext {
  headers: Headers
  session: Omit<Session, 'token'> | null

  authService: IAuthService
  userService: IUserService
}

export type { AppRouter, RouterInputs, RouterOutputs } from '@/routers/_app'

export type { IAccountRepository } from '@/contracts/repositories/account.repository'
export type { IBaseRepository } from '@/contracts/repositories/base.repository'
export type { IProfileRepository } from '@/contracts/repositories/profile.repository'
export type { IUserRepository } from '@/contracts/repositories/user.repository'

export type { IAuthService } from '@/contracts/services/auth.service'
export type { IUserService } from '@/contracts/services/user.service'
