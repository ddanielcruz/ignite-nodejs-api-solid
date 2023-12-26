import { describe, it, beforeEach, afterEach, vi, expect } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'

import { ValidateCheckIn } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckIn

describe('Validate Check-In', () => {
  beforeEach(async () => {
    vi.useFakeTimers()
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckIn(inMemoryCheckInsRepository)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate the check-in', async () => {
    const createdCheckIn = await inMemoryCheckInsRepository.create({
      userId: 'any_user_id',
      gymId: 'any_gym_id',
    })

    const { checkIn: validatedCheckIn } = await sut.execute({
      userId: 'any_user_id',
      checkInId: createdCheckIn.id,
    })

    expect(validatedCheckIn.validatedAt).toBeInstanceOf(Date)
    expect(inMemoryCheckInsRepository.items[0].validatedAt).toBe(
      validatedCheckIn.validatedAt,
    )
  })

  it('should not be able to validate a non-existing check-in', async () => {
    const promise = sut.execute({
      userId: 'any_user_id',
      checkInId: 'any_check_in_id',
    })

    await expect(promise).rejects.toThrow(ResourceNotFoundError)
  })

  it('should not be able to validate the check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date('2023-01-01T12:00:00'))
    const createdCheckIn = await inMemoryCheckInsRepository.create({
      userId: 'any_user_id',
      gymId: 'any_gym_id',
    })
    vi.setSystemTime(new Date('2023-01-01T12:20:01'))
    const promise = sut.execute({
      userId: 'any_user_id',
      checkInId: createdCheckIn.id,
    })
    await expect(promise).rejects.toThrow(LateCheckInValidationError)
  })
})
