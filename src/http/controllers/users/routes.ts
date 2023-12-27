import { FastifyInstance } from 'fastify'

import { verifyJwt } from '@/http/middleware/verify-jwt'

import { authenticate } from './authenticate'
import { register } from './register'
import { profile } from './profile'
import { refresh } from './refresh'

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)
  app.patch('/sessions/refresh', refresh)

  // Authenticated routes
  app.get('/users/me', { onRequest: [verifyJwt] }, profile)
}
