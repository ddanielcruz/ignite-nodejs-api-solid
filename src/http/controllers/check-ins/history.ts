import type { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { makeFetchUserCheckInsHistory } from '@/use-cases/factories/make-fetch-user-check-ins-history'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const querySchema = z.object({ page: z.coerce.number().min(1).default(1) })
  const { page } = querySchema.parse(request.query)
  const { checkIns } = await makeFetchUserCheckInsHistory().execute({
    userId: request.user.sub,
    page,
  })

  return reply.status(200).send(checkIns)
}
