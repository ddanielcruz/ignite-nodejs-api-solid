import type { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUser } from '@/use-cases/factories/make-authenticate-user'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  try {
    const body = bodySchema.parse(request.body)
    const { user } = await makeAuthenticateUser().execute(body)
    const token = await reply.jwtSign(
      { role: user.role },
      { sign: { sub: user.id } },
    )
    const refreshToken = await reply.jwtSign(
      { role: user.role },
      { sign: { sub: user.id, expiresIn: '7d' } },
    )

    return reply
      .status(201)
      .setCookie('refreshToken', refreshToken, {
        path: '/', // Gives access to all routes in the application.
        secure: true, // Ensures the browser only sends the cookie over HTTPS.
        sameSite: true, // Ensures the browser only sends the cookie with requests to the same domain.
        httpOnly: true, // Ensures the cookie is sent to the server only. This prevents client-side JavaScript from reading the cookie.
      })
      .send({ token })
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return reply.status(401).send({ message: error.message })
    }

    throw error
  }
}
