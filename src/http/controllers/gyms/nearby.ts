import type { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { makeFetchNearbyGyms } from '@/use-cases/factories/make-fetch-nearby-gyms'

export async function nearby(request: FastifyRequest, reply: FastifyReply) {
  const nearbyGymsQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.coerce.number().refine((value) => Math.abs(value) <= 180),
  })

  const query = nearbyGymsQuerySchema.parse(request.query)
  const { gyms } = await makeFetchNearbyGyms().execute({
    userLatitude: query.latitude,
    userLongitude: query.longitude,
  })

  return reply.status(200).send(gyms)
}
