import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { FetchUserCheckInsHistory } from './fetch-user-check-ins-history'

let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistory

describe('Fetch User Check-Ins History', () => {
  beforeEach(() => {
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsHistory(inMemoryCheckInsRepository)
  })

  it('should be able to fetch check-ins history', async () => {
    const checkInA = await inMemoryCheckInsRepository.create({
      userId: 'any_user_id',
      gymId: 'any_gym_id',
    })
    const checkInB = await inMemoryCheckInsRepository.create({
      userId: 'any_user_id',
      gymId: 'any_gym_id',
    })
    await inMemoryCheckInsRepository.create({
      userId: 'other_user_id',
      gymId: 'any_gym_id',
    })
    const { checkIns } = await sut.execute({ userId: 'any_user_id' })
    expect(checkIns).toEqual([checkInA, checkInB])
  })

  it('should be able to fetch paginated check-in history', async () => {
    for (let idx = 1; idx <= 22; idx++) {
      await inMemoryCheckInsRepository.create({
        userId: 'any_user_id',
        gymId: `gym_${idx}`,
      })
    }

    const { checkIns } = await sut.execute({ userId: 'any_user_id', page: 2 })
    expect(checkIns).toEqual([
      expect.objectContaining({ gymId: 'gym_21' }),
      expect.objectContaining({ gymId: 'gym_22' }),
    ])
  })
})
