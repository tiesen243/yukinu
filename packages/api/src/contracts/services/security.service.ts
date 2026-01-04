import type * as Validators from '@yukinu/validators/auth'

export interface ISecurityService {
  allSessions(
    input: Validators.AllSessionsInput,
  ): Promise<Validators.AllSessionsOutput>

  deleteSession(
    input: Validators.DeleteSessionInput,
  ): Promise<Validators.DeleteSessionOutput>

  changeUsername(
    input: Validators.ChangeUsernameInput,
  ): Promise<Validators.ChangeUsernameOutput>

  changePassword(
    input: Validators.ChangePasswordInput,
  ): Promise<Validators.ChangePasswordOutput>

  deleteAccount(
    input: Validators.DeleteAccountInput,
  ): Promise<Validators.DeleteAccountOutput>
}
