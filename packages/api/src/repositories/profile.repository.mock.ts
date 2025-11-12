import type { profiles } from '@yukinu/db/schema/profile'

import type { IProfileRepository } from '@/types'
import { BaseRepository } from '@/repositories/base.repository.mock'

export class ProfileRepository
  extends BaseRepository<typeof profiles>
  implements IProfileRepository
{
  protected override _data = [
    {
      id: 'user-1',
      fullName: 'Alice Smith',
      avatarUrl: 'https://example.com/avatars/alice.jpg',
      bio: 'Software developer and tech enthusiast.',
      gender: 'female',
      dateOfBirth: '1990-05-15',
      website: 'https://alicesmith.dev',
    },
    {
      id: 'user-2',
      fullName: 'Bob Johnson',
      avatarUrl: 'https://example.com/avatars/bob.jpg',
      bio: 'Digital artist and illustrator.',
      gender: 'male',
      dateOfBirth: '1985-09-22',
      website: 'https://bobjohnsonart.com',
    },
  ]
}
