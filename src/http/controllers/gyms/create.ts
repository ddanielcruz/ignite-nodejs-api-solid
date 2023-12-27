import type { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { makeCreateGym } from '@/use-cases/factories/make-create-gym'

export async function create(request: FastifyRequest, reply: FastifyReply) {
  const createGymSchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => Math.abs(value) <= 90),
    longitude: z.number().refine((value) => Math.abs(value) <= 180),
  })

  const data = createGymSchema.parse(request.body)
  const createGym = makeCreateGym()
  await createGym.execute({
    title: data.title,
    description: data.description,
    phone: data.phone,
    latitude: data.latitude,
    longitude: data.longitude,
  })

  return reply.status(201).send()
}
