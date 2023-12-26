import { Gym, GymsRepository } from '@/repositories/gyms-repository'

interface SearchGymsParams {
  query: string
  page?: number
}

interface SearchGymsResponse {
  gyms: Gym[]
}

export class SearchGyms {
  constructor(private readonly gymsRepository: GymsRepository) {}

  async execute({
    query,
    page,
  }: SearchGymsParams): Promise<SearchGymsResponse> {
    const gyms = await this.gymsRepository.searchMany(query, page)
    return { gyms }
  }
}
