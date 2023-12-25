import type { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { RegisterUser } from '@/use-cases/register-user'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const schema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  try {
    const body = schema.parse(request.body)
    await new RegisterUser(new PrismaUsersRepository()).execute(body)

    return reply.status(201).send()
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message })
    }

    throw error
  }
}
