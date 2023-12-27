import { FastifyInstance } from 'fastify'

import { verifyJwt } from '@/http/middleware/verify-jwt'

import { create } from './create'
import { nearby } from './nearby'
import { search } from './search'
import { verifyUserRole } from '@/http/middleware/verify-user-role'

export async function gymRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.get('/gyms/search', search)
  app.get('/gyms/nearby', nearby)
  app.post('/gyms', { onRequest: [verifyUserRole()] }, create)
}
