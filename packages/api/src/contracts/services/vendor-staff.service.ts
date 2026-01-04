import type * as Validators from '@yukinu/validators/vendor'

export interface IVendorStaffService {
  all(input: Validators.AllStaffsInput): Promise<Validators.AllStaffsOutput>

  invite(
    input: Validators.InviteStaffInput,
  ): Promise<Validators.InviteStaffOutput>

  acceptInvitation(
    input: Validators.AcceptStaffInvitationInput,
  ): Promise<Validators.AcceptStaffInvitationOutput>

  remove(
    input: Validators.RemoveStaffInput,
  ): Promise<Validators.RemoveStaffOutput>
}
