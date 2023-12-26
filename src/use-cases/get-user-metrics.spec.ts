import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMetrics } from './get-user-metrics'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetrics

describe('Get User Metrics', () => {
  beforeEach(() => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetrics(inMemoryCheckInsRepository)
  })

  it('should be able to get check-ins count from metrics', async () => {
    await inMemoryCheckInsRepository.create({
      userId: 'any_user_id',
      gymId: 'any_gym_id',
    })
    await inMemoryCheckInsRepository.create({
      userId: 'any_user_id',
      gymId: 'any_gym_id',
    })
    await inMemoryCheckInsRepository.create({
      userId: 'other_user_id',
      gymId: 'any_gym_id',
    })
    const { checkInsCount } = await sut.execute({ userId: 'any_user_id' })
    expect(checkInsCount).toBe(2)
  })
})
