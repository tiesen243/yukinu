import type { Database } from '@yukinu/db'
import type {
  AllVouchersInput,
  AllVouchersOutput,
  OneVoucherInput,
  OneVoucherOutput,
  CreateVoucherInput,
  CreateVoucherOutput,
  UpdateVoucherInput,
  UpdateVoucherOutput,
  DeleteVoucherInput,
  DeleteVoucherOutput,
} from '@yukinu/validators/general'

import { TRPCError } from '@trpc/server'

import type { IVoucherRepository } from '@/contracts/repositories/voucher.repository'
import type { IVoucherService } from '@/contracts/services/voucher.service'

export class VoucherService implements IVoucherService {
  constructor(
    private readonly _db: Database,
    private readonly _vourcher: IVoucherRepository,
  ) {}

  async all(input: AllVouchersInput): Promise<AllVouchersOutput> {
    const { page, limit, search } = input
    const offset = (page - 1) * limit

    const whereClauses = search ? [{ code: `%${search}%` }] : []

    const [vouchers, total] = await Promise.all([
      this._vourcher.all(
        whereClauses,
        { expiryDate: 'asc' },
        { limit, offset },
      ),
      this._vourcher.count(whereClauses),
    ])
    const totalPages = Math.ceil(total / limit)

    return {
      vouchers,
      pagination: { total, page, limit, totalPages },
    }
  }

  async one(input: OneVoucherInput): Promise<OneVoucherOutput> {
    const { id, code, isUsage } = input
    if (!id && !code)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Either id or code must be provided',
      })

    const whereClauses = code ? [{ code }] : [{ id }]

    const [voucher] = await this._vourcher.all(whereClauses, {}, { limit: 1 })
    if (!voucher)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Voucher not found' })

    if (isUsage) {
      if (voucher.expiryDate < new Date())
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Voucher has expired',
        })
      else if (voucher.quantity <= 0)
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Voucher has no remaining quantity',
        })

      await this._vourcher.update(voucher.id, {
        quantity: voucher.quantity - 1,
      })
    }

    return voucher
  }

  async create(input: CreateVoucherInput): Promise<CreateVoucherOutput> {
    const { code, discountAmount, discountPercentage, ...data } = input
    if (discountAmount && discountPercentage)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message:
          'Only one of discountAmount or discountPercentage can be provided',
      })

    const [existingVoucher] = await this._vourcher.all(
      [{ code: code.toUpperCase() }],
      {},
      { limit: 1 },
    )
    if (existingVoucher)
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'Voucher code already exists',
      })

    const newVoucher = await this._vourcher.create({
      ...data,
      code: code.toUpperCase(),
      discountAmount,
      discountPercentage,
      expiryDate: new Date(data.expiryDate),
    })

    return { id: newVoucher }
  }

  async update(input: UpdateVoucherInput): Promise<UpdateVoucherOutput> {
    const { id, code, discountAmount, discountPercentage, ...data } = input
    if (discountAmount && discountPercentage)
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message:
          'Only one of discountAmount or discountPercentage can be provided',
      })

    const voucher = await this._vourcher.find(id)
    if (!voucher)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Voucher not found' })

    if (code.toUpperCase() !== voucher.code) {
      const [existingVoucher] = await this._vourcher.all(
        [{ code: code.toUpperCase() }],
        {},
        { limit: 1 },
      )
      if (existingVoucher)
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Voucher code already exists',
        })
    }

    await this._vourcher.update(id, {
      ...data,
      code: code.toUpperCase(),
      discountAmount: discountPercentage ? null : discountAmount,
      discountPercentage: discountAmount ? null : discountPercentage,
      expiryDate: new Date(data.expiryDate),
    })

    return { id }
  }

  async delete(input: DeleteVoucherInput): Promise<DeleteVoucherOutput> {
    const { id } = input

    const voucher = await this._vourcher.find(id)
    if (!voucher)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Voucher not found' })

    await this._vourcher.delete(id)

    return { id }
  }
}
