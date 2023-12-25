import fastify from 'fastify'

import { appRoutes } from './http/routes'
import { errorHandler } from './http/middleware/error-handler'

export const app = fastify()
app.register(appRoutes)
app.setErrorHandler(errorHandler)
