import { randomUUID } from 'node:crypto'

import {
  CheckInsRepository,
  CreateCheckInParams,
  CheckIn,
} from '../check-ins-repository'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async create(params: CreateCheckInParams): Promise<CheckIn> {
    const checkIn: CheckIn = {
      id: randomUUID(),
      ...params,
      validatedAt: params.validatedAt ? new Date(params.validatedAt) : null,
      createdAt: params.createdAt ? new Date(params.createdAt) : new Date(),
    }

    this.items.push(checkIn)

    return checkIn
  }

  async countByUserId(userId: string): Promise<number> {
    return this.items.filter((checkIn) => checkIn.userId === userId).length
  }

  async findById(id: string): Promise<CheckIn | null> {
    return this.items.find((checkIn) => checkIn.id === id) ?? null
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const checkInOnSameDate = this.items.find(
      (checkIn) =>
        checkIn.userId === userId &&
        checkIn.createdAt.getDate() === date.getDate() &&
        checkIn.createdAt.getMonth() === date.getMonth() &&
        checkIn.createdAt.getFullYear() === date.getFullYear(),
    )

    return checkInOnSameDate || null
  }

  async findManyByUserId(userId: string, page = 1): Promise<CheckIn[]> {
    const offset = (page - 1) * 20
    return this.items
      .filter((checkIn) => checkIn.userId === userId)
      .slice(offset, offset + 20)
  }

  async save(checkIn: CheckIn): Promise<CheckIn> {
    const index = this.items.findIndex((item) => item.id === checkIn.id)
    if (index >= 0) {
      this.items[index] = checkIn
    }

    return checkIn
  }
}
