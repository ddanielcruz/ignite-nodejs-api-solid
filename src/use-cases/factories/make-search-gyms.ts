import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

import { SearchGyms } from '../search-gyms'

export function makeSearchGyms(): SearchGyms {
  const gymsRepository = new PrismaGymsRepository()
  return new SearchGyms(gymsRepository)
}
