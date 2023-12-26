import type { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUser } from '@/use-cases/factories/make-authenticate-user'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticatedBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  try {
    const body = authenticatedBodySchema.parse(request.body)
    const authenticateUser = makeAuthenticateUser()
    const { user } = await authenticateUser.execute(body)
    const token = await reply.jwtSign({}, { sign: { sub: user.id } })

    return reply.status(201).send({ token })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(401).send({ message: error.message })
    }

    throw error
  }
}
