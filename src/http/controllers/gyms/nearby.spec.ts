import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/tests/create-and-authenticate-user'

describe('Fetch Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app, 'ADMIN')
    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: 'any_gym_id',
        title: 'nearby_gym',
        description: 'any_gym_description',
        latitude: 40.7227169,
        longitude: -73.9547756,
        phone: 'any_gym_phone',
      })
    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        id: 'any_gym_id',
        title: 'distant_gym',
        description: 'any_gym_description',
        latitude: 0,
        longitude: 0,
        phone: 'any_gym_phone',
      })
    const response = await request(app.server)
      .get('/gyms/nearby')
      .set('Authorization', `Bearer ${token}`)
      .query({
        latitude: 40.7231808,
        longitude: -73.9540801,
      })

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(1)
    expect(response.body[0].title).toEqual('nearby_gym')
  })
})
