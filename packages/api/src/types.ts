import type { UserValidators } from '@yukinu/validators/user'

import type { IAuthService } from '@/contracts/services/auth.service'
import type { IUserService } from '@/contracts/services/user.service'

export interface TRPCMeta {
  message?: string
  role?: UserValidators.Role[]
}

export interface TRPCContext {
  headers: Headers
  session: { userId: string; role: UserValidators.Role } | null
  services: {
    auth: IAuthService
    user: IUserService
  }
}
