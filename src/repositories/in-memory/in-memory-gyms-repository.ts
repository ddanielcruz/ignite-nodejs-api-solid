import { randomUUID } from 'node:crypto'
import { Decimal } from '@prisma/client/runtime/library'

import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'

import {
  CreateGymParams,
  FindManyNearbyParams,
  Gym,
  GymsRepository,
} from '../gyms-repository'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async create(params: CreateGymParams): Promise<Gym> {
    const checkIn: Gym = {
      id: params.id ?? randomUUID(),
      title: params.title,
      description: params.description ?? null,
      phone: params.phone ?? null,
      latitude: new Decimal(params.latitude.toString()),
      longitude: new Decimal(params.longitude.toString()),
    }

    this.items.push(checkIn)

    return checkIn
  }

  async findById(id: string): Promise<Gym | null> {
    return this.items.find((gym) => gym.id === id) ?? null
  }

  async findManyNearby(params: FindManyNearbyParams): Promise<Gym[]> {
    return this.items.filter((gym) => {
      const distance = getDistanceBetweenCoordinates(params, {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      })

      return distance <= 10
    })
  }

  async searchMany(query: string, page = 1): Promise<Gym[]> {
    const offset = (page - 1) * 20
    query = query.trim().toLowerCase()

    return this.items
      .filter((gym) => gym.title.toLowerCase().includes(query))
      .slice(offset, offset + 20)
  }
}
