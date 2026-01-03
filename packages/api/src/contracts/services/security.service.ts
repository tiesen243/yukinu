import type { AuthValidators } from '@yukinu/validators/auth'

export interface ISecurityService {
  allSessions(
    input: AuthValidators.AllSessionsInput,
  ): Promise<AuthValidators.AllSessionsOutput>

  deleteSession(
    input: AuthValidators.DeleteSessionInput,
  ): Promise<AuthValidators.DeleteSessionOutput>

  changeUsername(
    input: AuthValidators.ChangeUsernameInput,
  ): Promise<AuthValidators.ChangeUsernameOutput>

  deleteAccount(
    input: AuthValidators.DeleteAccountInput,
  ): Promise<AuthValidators.DeleteAccountOutput>
}
