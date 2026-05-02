import * as z from 'zod'

import { VendorEntity } from '@/modules/merchant/domain/entities/vendor.entity'
import { Pagination } from '@/shared/schema'

export namespace AllVendorsDto {
  export const input = Pagination.input.extend({
    search: z.string().optional(),
    status: z.enum(VendorEntity.statuses).optional(),
  })
  export type Input = z.infer<typeof input>

  export const output = z.object({
    vendors: z.array(
      z.instanceof(VendorEntity).transform((val) => val as VendorEntity & {
          owner: { id: string; username: string }
          staffCount: number
        }),
    ),
    pagination: Pagination.output,
  })
  export type Output = z.infer<typeof output>
}

AllVendorsDto.output.parse({
  vendors: [
    Object.assign(
      new VendorEntity({
        id: 'r5t7y9u1i3o5p7a9s1d3f5g8',
        createdAt: new Date('2026-05-01T10:05:12.553Z'),
        updatedAt: new Date('2026-05-01T10:05:12.553Z'),
        description: null,
        image: null,
        address: null,
        contact: null,
        payoutBankName: null,
        payoutAccountName: null,
        payoutAccountNumber: null,
        ownerId: 'p2b8v4n1m9k3j5l7z1x6c2v4',
        status: 'approved',
        name: 'Tiesen Tech Store',
      }),
      {
        owner: {
          id: 'p2b8v4n1m9k3j5l7z1x6c2v4',
          username: 'tiesen_tech',
        },
        staffCount: 0,
      },
    ),
  ],
  pagination: {
    total: 1,
    page: 1,
    limit: 10,
    totalPages: 1,
  },
})
