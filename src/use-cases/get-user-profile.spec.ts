import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { GetUserProfile } from './get-user-profile'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: GetUserProfile

describe('Get User Profile', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfile(inMemoryUsersRepository)
  })

  it('should be able to get user profile', async () => {
    const user = await inMemoryUsersRepository.create({
      name: 'any_name',
      email: 'any_email@example.com',
      passwordHash: await hash('any_password', 6),
    })
    const { user: authenticatedUser } = await sut.execute({ id: user.id })
    expect(user).toEqual(authenticatedUser)
  })

  it('should not be able to get user profile with wrong id', async () => {
    const promise = sut.execute({ id: 'any_id' })
    await expect(promise).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
