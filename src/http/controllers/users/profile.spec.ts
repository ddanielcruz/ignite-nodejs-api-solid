import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'

describe('Get User Profile (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to get user profile', async () => {
    const { token, user } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .get('/users/me')
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      id: expect.any(String),
      name: 'John Doe',
      email: user.email,
      createdAt: expect.any(String),
    })
  })
})
