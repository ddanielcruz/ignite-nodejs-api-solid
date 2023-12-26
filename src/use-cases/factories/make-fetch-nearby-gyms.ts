import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

import { FetchNearbyGyms } from '../fetch-nearby-gyms'

export function makeFetchNearbyGyms(): FetchNearbyGyms {
  const gymsRepository = new PrismaGymsRepository()
  return new FetchNearbyGyms(gymsRepository)
}
