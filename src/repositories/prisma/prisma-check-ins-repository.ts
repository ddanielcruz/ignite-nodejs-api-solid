import dayjs from 'dayjs'

import { prisma } from '@/lib/prisma'

import {
  CheckInsRepository,
  CheckIn,
  CreateCheckInParams,
} from '../check-ins-repository'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(params: CreateCheckInParams): Promise<CheckIn> {
    return await prisma.checkIn.create({ data: params })
  }

  async countByUserId(userId: string): Promise<number> {
    return await prisma.checkIn.count({ where: { userId } })
  }

  async findById(id: string): Promise<CheckIn | null> {
    return await prisma.checkIn.findUnique({ where: { id } })
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date,
  ): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf('day').toDate()
    const endOfTheDay = dayjs(date).endOf('day').toDate()

    return await prisma.checkIn.findFirst({
      where: {
        userId,
        createdAt: {
          gte: startOfTheDay,
          lte: endOfTheDay,
        },
      },
    })
  }

  async findManyByUserId(userId: string, page = 1): Promise<CheckIn[]> {
    const offset = (page - 1) * 20
    return await prisma.checkIn.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
      skip: offset,
    })
  }

  async save(data: CheckIn): Promise<CheckIn> {
    return await prisma.checkIn.update({ where: { id: data.id }, data })
  }
}
