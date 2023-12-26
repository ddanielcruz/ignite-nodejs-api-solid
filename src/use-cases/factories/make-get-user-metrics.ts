import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'

import { GetUserMetrics } from '../get-user-metrics'

export function makeGetUserMetrics(): GetUserMetrics {
  const checkInsRepository = new PrismaCheckInsRepository()
  return new GetUserMetrics(checkInsRepository)
}
