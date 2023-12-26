import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'

import { CreateGym } from '../create-gym'

export function makeCreateGym(): CreateGym {
  const gymsRepository = new PrismaGymsRepository()
  return new CreateGym(gymsRepository)
}
