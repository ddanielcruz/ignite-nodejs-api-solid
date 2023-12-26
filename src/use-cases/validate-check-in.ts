import {
  CheckIn,
  CheckInsRepository,
} from '@/repositories/check-ins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'

interface ValidateCheckInParams {
  userId: string
  checkInId: string
}

interface ValidateCheckInResponse {
  checkIn: CheckIn
}

export class ValidateCheckIn {
  constructor(private readonly checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
    checkInId,
  }: ValidateCheckInParams): Promise<ValidateCheckInResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)
    if (!checkIn) {
      throw new ResourceNotFoundError()
    }

    const distanceInMinutesFromCreation = Math.abs(
      (new Date().getTime() - checkIn.createdAt.getTime()) / 60000,
    )

    if (distanceInMinutesFromCreation > 20) {
      throw new LateCheckInValidationError()
    }

    checkIn.validatedAt = new Date()
    await this.checkInsRepository.save(checkIn)

    return { checkIn }
  }
}
