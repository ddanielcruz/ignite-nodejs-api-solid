import { makeGetUserProfile } from '@/use-cases/factories/make-get-user-profile'
import type { FastifyRequest, FastifyReply } from 'fastify'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  const getUserProfile = makeGetUserProfile()
  const { user } = await getUserProfile.execute({ id: request.user.sub })

  return reply.status(200).send({
    ...user,
    passwordHash: undefined,
  })
}
