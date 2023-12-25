import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

import { RegisterUser } from '../register-user'

export function makeRegisterUser() {
  const prismaUsersRepository = new PrismaUsersRepository()
  return new RegisterUser(prismaUsersRepository)
}
