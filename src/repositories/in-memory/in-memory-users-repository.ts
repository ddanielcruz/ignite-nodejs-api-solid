import { randomUUID } from 'node:crypto'

import {
  type CreateUserParams,
  type User,
  UsersRepository,
} from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async create(params: CreateUserParams): Promise<User> {
    const user: User = {
      id: randomUUID(),
      createdAt: new Date(),
      ...params,
    }

    this.items.push(user)

    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.items.find((user) => user.email === email) ?? null
  }

  async findById(id: string): Promise<User | null> {
    return this.items.find((user) => user.id === id) ?? null
  }
}
