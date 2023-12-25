import type { User } from '@prisma/client'

export interface CreateUserParams {
  name: string
  email: string
  passwordHash: string
}

export interface UsersRepository {
  create(params: CreateUserParams): Promise<User>
  findByEmail(email: string): Promise<User | null>
}

export { User }
