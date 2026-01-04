import type { IOrderService } from '@/contracts/services/order.service'
import type { Database } from '@yukinu/db'
import type * as Validators from '@yukinu/validators/order'

export class OrderService implements IOrderService {
  constructor(private readonly _db: Database) {}

  all(_input: Validators.AllInput): Promise<Validators.AllOutput> {
    throw new Error('Method not implemented.')
  }

  one(_input: Validators.OneInput): Promise<Validators.OneOutput> {
    throw new Error('Method not implemented.')
  }

  checkout(
    _input: Validators.CheckoutInput,
  ): Promise<Validators.CheckoutOutput> {
    throw new Error('Method not implemented.')
  }

  update(_input: Validators.UpdateInput): Promise<Validators.UpdateOutput> {
    throw new Error('Method not implemented.')
  }
}
