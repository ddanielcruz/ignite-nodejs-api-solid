import type { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { makeSearchGyms } from '@/use-cases/factories/make-search-gyms'

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchGymsQuerySchema = z.object({
    q: z.string(),
    page: z.coerce.number().min(1).default(1),
  })

  const { q: query, page } = searchGymsQuerySchema.parse(request.query)
  const { gyms } = await makeSearchGyms().execute({ query, page })

  return reply.status(200).send(gyms)
}
