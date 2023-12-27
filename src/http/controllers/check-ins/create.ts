import type { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { makeCheckInUser } from '@/use-cases/factories/make-check-in-user'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({ gymId: z.string().cuid() })
  const bodySchema = z.object({
    latitude: z.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.number().refine((value) => Math.abs(value) <= 180),
  })

  const params = paramsSchema.parse(request.params)
  const body = bodySchema.parse(request.body)
  await makeCheckInUser().execute({
    gymId: params.gymId,
    userId: request.user.sub,
    userLatitude: body.latitude,
    userLongitude: body.longitude,
  })

  return reply.status(201).send()
}
