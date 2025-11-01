import type { profiles } from '@yukinu/db/schema/profile'

import type { IProfileRepository } from '../contracts/repositories/profile.repository'
import { BaseRepository } from './base.repository.mock'

export class ProfileRepository
  extends BaseRepository<typeof profiles>
  implements IProfileRepository
{
  protected override _data = [
    {
      id: 'admin-1',
      fullName: 'Mock Admin',
      avatarUrl: 'https://mock.com/avatar/admin.png',
      bio: 'This is a mock admin user.',
      gender: 'other',
      dateOfBirth: '1990-01-01',
      website: 'https://mockadmin.com',
    },
    {
      id: 'user-1',
      fullName: 'Mock User',
      avatarUrl: 'https://mock.com/avatar/user.png',
      bio: 'This is a mock regular user.',
      gender: 'other',
      dateOfBirth: '1995-05-15',
      website: 'https://mockuser.com',
    },
  ]
}
