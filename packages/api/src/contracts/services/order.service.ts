import type * as Validators from '@yukinu/validators/order'

export interface IOrderService {
  all(input: Validators.AllInput): Promise<Validators.AllOutput>

  checkout(input: Validators.CheckoutInput): Promise<Validators.CheckoutOutput>
}
