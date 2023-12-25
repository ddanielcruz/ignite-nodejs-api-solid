import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

import { AuthenticateUser } from '../authenticate-user'

export function makeAuthenticateUser() {
  const prismaUsersRepository = new PrismaUsersRepository()
  return new AuthenticateUser(prismaUsersRepository)
}
