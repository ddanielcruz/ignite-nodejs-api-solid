import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest'
import { Decimal } from '@prisma/client/runtime/library'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { CheckInUser, CheckInUserParams } from './check-in-user'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let inMemoryGymsRepository: InMemoryGymsRepository
let sut: CheckInUser
let params: CheckInUserParams

describe('Check In User', () => {
  beforeEach(async () => {
    vi.useFakeTimers()
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    inMemoryGymsRepository = new InMemoryGymsRepository()
    await inMemoryGymsRepository.create({
      id: 'any_gym_id',
      title: 'any_gym_title',
      description: 'any_gym_description',
      latitude: new Decimal(40.7227169),
      longitude: new Decimal(-73.9547756),
      phone: 'any_gym_phone',
    })
    sut = new CheckInUser(inMemoryCheckInsRepository, inMemoryGymsRepository)
    params = {
      userId: 'any_user_id',
      gymId: 'any_gym_id',
      userLatitude: 40.7231808,
      userLongitude: -73.9540801,
    }
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute(params)
    expect(checkIn.id).toBeTruthy()
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2023, 0, 1))
    await sut.execute(params)
    await expect(sut.execute(params)).rejects.toThrow(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2023, 0, 1))
    await sut.execute(params)
    vi.setSystemTime(new Date(2023, 0, 2))
    await expect(sut.execute(params)).resolves.toBeTruthy()
  })

  it('should not be able to check in on distant gym', async () => {
    const promise = sut.execute({
      ...params,
      userLatitude: 40.7203959,
      userLongitude: -73.956022,
    })

    await expect(promise).rejects.toThrow(MaxDistanceError)
  })
})
