import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

import { CheckInUser } from '../check-in-user'

export function makeCheckInUser(): CheckInUser {
  const gymsRepository = new PrismaGymsRepository()
  const checkInRepository = new PrismaCheckInsRepository()
  return new CheckInUser(checkInRepository, gymsRepository)
}
