import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

import { FetchUserCheckInsHistory } from '../fetch-user-check-ins-history'

export function makeFetchUserCheckInsHistory(): FetchUserCheckInsHistory {
  const checkInsRepository = new PrismaCheckInsRepository()
  return new FetchUserCheckInsHistory(checkInsRepository)
}
