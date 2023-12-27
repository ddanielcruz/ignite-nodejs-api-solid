import { FastifyInstance } from 'fastify'

import { verifyJwt } from '@/http/middleware/verify-jwt'

import { authenticate } from './authenticate'
import { register } from './register'
import { profile } from './profile'

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  // Authenticated routes
  app.get('/users/me', { onRequest: [verifyJwt] }, profile)
}
