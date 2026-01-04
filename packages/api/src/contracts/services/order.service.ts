import type * as Validators from '@yukinu/validators/order'

export interface IOrderService {
  all(input: Validators.AllInput): Promise<Validators.AllOutput>

  one(input: Validators.OneInput): Promise<Validators.OneOutput>

  checkout(input: Validators.CheckoutInput): Promise<Validators.CheckoutOutput>

  update(input: Validators.UpdateInput): Promise<Validators.UpdateOutput>
}
