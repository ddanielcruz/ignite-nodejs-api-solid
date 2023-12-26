import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

import { ValidateCheckIn } from '../validate-check-in'

export function makeValidateCheckIn(): ValidateCheckIn {
  const checkInsRepository = new PrismaCheckInsRepository()
  return new ValidateCheckIn(checkInsRepository)
}
