import type { Gym, Prisma } from '@prisma/client'

export type CreateGymParams = Prisma.GymUncheckedCreateInput

export { Gym }

export interface FindManyNearbyParams {
  latitude: number
  longitude: number
}

export interface GymsRepository {
  create(params: CreateGymParams): Promise<Gym>
  findById(id: string): Promise<Gym | null>
  findManyNearby(params: FindManyNearbyParams): Promise<Gym[]>
  searchMany(query: string, page?: number): Promise<Gym[]>
}
