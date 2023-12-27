import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'

import { gymRoutes } from './http/controllers/gyms/routes'
import { userRoutes } from './http/controllers/users/routes'
import { errorHandler } from './http/middleware/error-handler'
import { env } from './config/env'
import { checkInsRoutes } from './http/controllers/check-ins/routes'

export const app = fastify()
app.register(fastifyJwt, { secret: env.JWT_SECRET })
app.register(userRoutes)
app.register(gymRoutes)
app.register(checkInsRoutes)
app.setErrorHandler(errorHandler)
