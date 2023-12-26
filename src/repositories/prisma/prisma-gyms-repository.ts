import { prisma } from '@/lib/prisma'

import {
  GymsRepository,
  FindManyNearbyParams,
  CreateGymParams,
  Gym,
} from '../gyms-repository'

export class PrismaGymsRepository implements GymsRepository {
  create(params: CreateGymParams): Promise<Gym> {
    return prisma.gym.create({ data: params })
  }

  findById(id: string): Promise<Gym | null> {
    return prisma.gym.findUnique({ where: { id } })
  }

  async findManyNearby({
    latitude,
    longitude,
  }: FindManyNearbyParams): Promise<Gym[]> {
    return await prisma.$queryRaw<Gym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `
  }

  searchMany(query: string, page = 1): Promise<Gym[]> {
    const offset = (page - 1) * 20
    return prisma.gym.findMany({
      where: {
        title: {
          contains: query,
          mode: 'insensitive',
        },
      },
      orderBy: { title: 'asc' },
      take: 20,
      skip: offset,
    })
  }
}
