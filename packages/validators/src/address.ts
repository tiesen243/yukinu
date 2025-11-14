import * as z from 'zod'

export namespace AddressModels {
  //#region Address Schema
  export const address = z.object({
    id: z.cuid2('Invalid address ID'),
    userId: z.cuid2('Invalid user ID'),
    recipientName: z.string().min(1).max(255),
    phoneNumber: z.string().min(1).max(20),
    street: z.string().min(1).max(255),
    city: z.string().min(1).max(100),
    state: z.string().min(1).max(100),
    postalCode: z.string().min(1).max(20),
    country: z.string().min(1).max(100),
    isDefault: z.boolean(),
  })
  export type Address = z.infer<typeof address>
  //#endregion

  //#region All Addresses Schema
  export const allInput = z.object({
    userId: z.cuid2('Invalid user ID'),
  })
  export type AllInput = z.infer<typeof allInput>

  export const allOutput = z.object({
    addresses: z.array(address),
  })
  export type AllOutput = z.infer<typeof allOutput>
  //#endregion

  //#region One Address Schema
  export const oneInput = address.pick({ id: true, userId: true })
  export type OneInput = z.infer<typeof oneInput>

  export const oneOutput = address
  export type OneOutput = z.infer<typeof oneOutput>
  //#endregion

  //#region Create Address Schema
  export const createInput = address.omit({ id: true, isDefault: true })
  export type CreateInput = z.infer<typeof createInput>

  export const createOutput = z.object({ addressId: address.shape.id })
  export type CreateOutput = z.infer<typeof createOutput>
  //#endregion

  //#region Update Address Schema
  export const updateInput = address.partial()
  export type UpdateInput = z.infer<typeof updateInput>

  export const updateOutput = z.object({ addressId: address.shape.id })
  export type UpdateOutput = z.infer<typeof updateOutput>
  //#endregion

  //#region Delete Address Schema
  export const deleteInput = address.pick({ id: true, userId: true })
  export type DeleteInput = z.infer<typeof deleteInput>

  export const deleteOutput = z.object({ addressId: address.shape.id })
  export type DeleteOutput = z.infer<typeof deleteOutput>
  //#endregion
}
