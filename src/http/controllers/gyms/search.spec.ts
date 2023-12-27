import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'

async function createGym(token: string, title: string) {
  await request(app.server)
    .post('/gyms')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title,
      description: 'any_gym_description',
      phone: 'any_gym_phone',
      latitude: 0,
      longitude: 0,
    })
}

describe('Search Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to search gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN')

    await Promise.all([
      createGym(token, 'JavaScript Gym'),
      createGym(token, 'TypeScrip Gym'),
    ])

    const response = await request(app.server)
      .get('/gyms/search')
      .set('Authorization', `Bearer ${token}`)
      .query({ q: 'javascript' })

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(1)
    expect(response.body[0].title).toEqual('JavaScript Gym')
  })
})
