import type { CheckIn, Prisma } from '@prisma/client'

export type CreateCheckInParams = Prisma.CheckInUncheckedCreateInput

export { CheckIn }

export interface CheckInsRepository {
  create(params: CreateCheckInParams): Promise<CheckIn>
  countByUserId(userId: string): Promise<number>
  findById(id: string): Promise<CheckIn | null>
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
  findManyByUserId(userId: string, page?: number): Promise<CheckIn[]>
  save(checkIn: CheckIn): Promise<CheckIn>
}
