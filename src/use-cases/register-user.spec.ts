import { describe, it, expect, beforeEach } from 'vitest'
import { compare } from 'bcryptjs'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { RegisterUser } from './register-user'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: RegisterUser

describe('Register User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new RegisterUser(inMemoryUsersRepository)
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      email: 'any_user@example.com',
      name: 'any_name',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare('123456', user.passwordHash)
    expect(isPasswordCorrectlyHashed).toEqual(true)
  })

  it('should not be able to register with same email twice', async () => {
    const params = {
      email: 'any_user@example.com',
      name: 'any_name',
      password: '123456',
    }

    await sut.execute(params)
    await expect(sut.execute(params)).rejects.toBeInstanceOf(
      UserAlreadyExistsError,
    )
  })
})
