import { UsersRepository } from '@/repositories/users-repository'

import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface GetUserProfileParams {
  id: string
}

export class GetUserProfile {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({ id }: GetUserProfileParams) {
    const user = await this.usersRepository.findById(id)
    if (!user) {
      throw new ResourceNotFoundError()
    }

    return { user }
  }
}
