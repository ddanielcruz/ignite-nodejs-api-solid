import { FastifyInstance } from 'fastify'

import { verifyJwt } from '@/http/middleware/verify-jwt'

import { create } from './create'
import { validate } from './validate'
import { metrics } from './metrics'
import { history } from './history'

export async function checkInsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)

  app.get('/check-ins/history', history)
  app.get('/check-ins/metrics', metrics)
  app.patch('/check-ins/:checkInId/validate', validate)
  app.post('/gyms/:gymId/check-ins', create)
}
