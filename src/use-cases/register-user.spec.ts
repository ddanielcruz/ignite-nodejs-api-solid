import { describe, it, expect } from 'vitest'
import { compare } from 'bcryptjs'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { RegisterUser } from './register-user'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

const makeSut = () => {
  const inMemoryUsersRepository = new InMemoryUsersRepository()
  const sut = new RegisterUser(inMemoryUsersRepository)

  return { sut, inMemoryUsersRepository }
}

describe('Register User', () => {
  it('should hash user password upon registration', async () => {
    const { sut } = makeSut()
    const { user } = await sut.execute({
      email: 'any_user@example.com',
      name: 'any_name',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare('123456', user.passwordHash)
    expect(isPasswordCorrectlyHashed).toEqual(true)
  })

  it('should not be able to register with same email twice', async () => {
    const { sut } = makeSut()
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
