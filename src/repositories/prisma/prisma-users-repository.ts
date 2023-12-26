import { User } from '@prisma/client'

import { prisma } from '@/lib/prisma'

import type { UsersRepository, CreateUserParams } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
  async create(data: CreateUserParams) {
    return await prisma.user.create({ data })
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { email } })
  }

  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { id } })
  }
}
