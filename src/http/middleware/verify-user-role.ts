import { Role } from '@prisma/client'
import { FastifyReply, FastifyRequest } from 'fastify'

export function verifyUserRole(roleToVerify: Role = 'ADMIN') {
  return async function (request: FastifyRequest, reply: FastifyReply) {
    const { role } = request.user
    if (role !== roleToVerify) {
      return reply.status(403).send({ message: 'Forbidden.' })
    }
  }
}
