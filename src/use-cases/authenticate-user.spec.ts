import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { AuthenticateUser } from './authenticate-user'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: AuthenticateUser

describe('Authenticate User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUser(inMemoryUsersRepository)
  })

  it('should be able to authenticate', async () => {
    const password = '123456'
    const user = await inMemoryUsersRepository.create({
      name: 'any_name',
      email: 'any_email@example.com',
      passwordHash: await hash(password, 6),
    })
    const { user: authenticatedUser } = await sut.execute({
      email: user.email,
      password,
    })
    expect(user).toEqual(authenticatedUser)
  })

  it('should not be able to authenticate with wrong email', async () => {
    const promise = sut.execute({
      email: 'any_email@example.com',
      password: 'any_password',
    })
    await expect(promise).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'any_name',
      email: 'any_email@example.com',
      passwordHash: await hash('123456', 6),
    })
    const promise = sut.execute({
      email: user.email,
      password: 'wrong_password',
    })
    await expect(promise).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
