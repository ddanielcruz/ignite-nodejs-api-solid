import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

import { GetUserProfile } from '../get-user-profile'

export function makeGetUserProfile(): GetUserProfile {
  const usersRepository = new PrismaUsersRepository()
  return new GetUserProfile(usersRepository)
}
