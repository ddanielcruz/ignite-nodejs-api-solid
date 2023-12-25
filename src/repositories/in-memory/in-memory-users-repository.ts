import {
  type CreateUserParams,
  type User,
  UsersRepository,
} from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public users: User[] = []

  async create(params: CreateUserParams): Promise<User> {
    const createdAt = new Date()
    const user: User = {
      id: `user-${createdAt.getTime()}`,
      createdAt,
      ...params,
    }

    this.users.push(user)

    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) ?? null
  }
}
