import { describe, it, expect, beforeEach } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { CreateGym } from './create-gym'

let inMemoryGymsRepository: InMemoryGymsRepository
let sut: CreateGym

describe('Create Gym', () => {
  beforeEach(() => {
    inMemoryGymsRepository = new InMemoryGymsRepository()
    sut = new CreateGym(inMemoryGymsRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'any_title',
      description: 'any_description',
      phone: 'any_phone',
      latitude: 0,
      longitude: 0,
    })

    expect(gym.id).toBeTruthy()
  })
})
