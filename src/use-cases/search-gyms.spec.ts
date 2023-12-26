import { describe, it, expect, beforeEach } from 'vitest'

import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

import { SearchGyms } from './search-gyms'

let inMemoryGymsRepository: InMemoryGymsRepository
let sut: SearchGyms

describe('Create Gym', () => {
  beforeEach(() => {
    inMemoryGymsRepository = new InMemoryGymsRepository()
    sut = new SearchGyms(inMemoryGymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await inMemoryGymsRepository.create({
      title: 'TypeScript Gym',
      latitude: 0,
      longitude: 0,
    })
    const gymB = await inMemoryGymsRepository.create({
      title: 'JavaScript Gym',
      latitude: 0,
      longitude: 0,
    })
    const gymC = await inMemoryGymsRepository.create({
      title: 'Another JavaScript Gym',
      latitude: 0,
      longitude: 0,
    })
    const { gyms } = await sut.execute({ query: 'javascript' })
    expect(gyms).toEqual([gymB, gymC])
  })

  it('should be able to fetch paginated check-in history', async () => {
    for (let idx = 1; idx <= 22; idx++) {
      await inMemoryGymsRepository.create({
        title: `JavaScript Gym ${idx}`,
        latitude: 0,
        longitude: 0,
      })
    }

    const { gyms } = await sut.execute({ query: 'javascript', page: 2 })
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript Gym 21' }),
      expect.objectContaining({ title: 'JavaScript Gym 22' }),
    ])
  })
})
