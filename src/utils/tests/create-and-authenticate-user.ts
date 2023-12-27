import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  const email = `user-${Date.now()}@example.com`
  const password = '123456'

  await request(app.server).post('/users').send({
    name: 'John Doe',
    email,
    password,
  })

  const response = await request(app.server)
    .post('/sessions')
    .send({ email, password })

  const token: string = response.body.token

  return {
    token,
    user: {
      email,
    },
  }
}
