import type { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { AuthenticateUser } from '@/use-cases/authenticate-user'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'

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
    await new AuthenticateUser(new PrismaUsersRepository()).execute(body)

    return reply.status(204).send()
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(401).send({ message: error.message })
    }

    throw error
  }
}
