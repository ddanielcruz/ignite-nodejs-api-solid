import type { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { makeValidateCheckIn } from '@/use-cases/factories/make-validate-check-in'

export async function validate(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    checkInId: z.string().cuid(),
  })

  const params = paramsSchema.parse(request.params)
  await makeValidateCheckIn().execute({
    userId: request.user.sub,
    checkInId: params.checkInId,
  })

  return reply.status(204).send()
}
