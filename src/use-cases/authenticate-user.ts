import { compare } from 'bcryptjs'

import { UsersRepository } from '@/repositories/users-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

interface AuthenticateUserParams {
  email: string
  password: string
}

export class AuthenticateUser {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute({ email, password }: AuthenticateUserParams) {
    const user = await this.usersRepository.findByEmail(email)
    if (!user) {
      throw new InvalidCredentialsError()
    }

    const doesPasswordMatch = await compare(password, user.passwordHash)
    if (!doesPasswordMatch) {
      throw new InvalidCredentialsError()
    }

    return { user }
  }
}
