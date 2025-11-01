import type { AuthValidator } from '@yukinu/validators/auth'

export interface IAuthService {
  register(data: AuthValidator.RegisterBody): Promise<{ id: string }>

  changePassword(
    userId: string,
    data: AuthValidator.ChangePasswordBody,
  ): Promise<{ id: string }>
}
