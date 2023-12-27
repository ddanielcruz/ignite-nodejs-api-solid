import type { FastifyRequest, FastifyReply } from 'fastify'

import { makeGetUserMetrics } from '@/use-cases/factories/make-get-user-metrics'

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const { checkInsCount } = await makeGetUserMetrics().execute({
    userId: request.user.sub,
  })

  return reply.status(200).send({ checkInsCount })
}
