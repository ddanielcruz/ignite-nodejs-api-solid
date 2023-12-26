import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'

import { appRoutes } from './http/routes'
import { errorHandler } from './http/middleware/error-handler'
import { env } from './config/env'

export const app = fastify()
app.register(fastifyJwt, { secret: env.JWT_SECRET })
app.register(appRoutes)
app.setErrorHandler(errorHandler)
