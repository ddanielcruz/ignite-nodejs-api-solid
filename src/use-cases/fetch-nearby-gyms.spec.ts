import { describe, it, beforeEach, expect } from 'vitest'
import { Decimal } from '@prisma/client/runtime/library'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { FetchNearbyGyms } from './fetch-nearby-gyms'

let inMemoryGymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGyms

describe('Fetch Nearby Gyms', () => {
  beforeEach(() => {
    inMemoryGymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGyms(inMemoryGymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    const nearbyGym = await inMemoryGymsRepository.create({
      id: 'any_gym_id',
      title: 'nearby_gym',
      description: 'any_gym_description',
      latitude: new Decimal(40.7227169),
      longitude: new Decimal(-73.9547756),
      phone: 'any_gym_phone',
    })
    await inMemoryGymsRepository.create({
      id: 'any_gym_id',
      title: 'distant_gym',
      description: 'any_gym_description',
      latitude: new Decimal(0),
      longitude: new Decimal(0),
      phone: 'any_gym_phone',
    })
    const { gyms } = await sut.execute({
      userLatitude: 40.7231808,
      userLongitude: -73.9540801,
    })
    expect(gyms).toEqual([nearbyGym])
  })
})
