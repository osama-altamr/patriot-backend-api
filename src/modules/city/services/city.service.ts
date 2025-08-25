// FILE: src/services/city.service.ts

import { Injectable, NotFoundException } from '@nestjs/common'
import { CityRepository } from '../repository/city.repository' // Adjust path
import { CreateCityDto } from '../api/dto/request/create-city.dto'
import { UpdateCityDto } from '../api/dto/request/update-city.dto'
import { City } from 'src/database' // Adjust path
import { StateService } from '/states/services/state.service'
import { GetAllCitiesDto } from '../api/dto/request/get-all.dto'

@Injectable()
export class CityService {
  constructor(
      private readonly cityRepo: CityRepository,
      private readonly stateService: StateService,
    ) {}

  async createCity(cityData: CreateCityDto): Promise<City | City[]> {
    cityData.state = await this.stateService.getState(cityData.stateId)
    return this.cityRepo.create(cityData as any)
  }

  async getAllCities(search?: string, stateId?: string, query?: GetAllCitiesDto){
    return this.cityRepo.getAllCities(search, stateId, query)
  }

  async getCity(id: string): Promise<City | null> {
    const city = await this.cityRepo.findOneByIdWithPop(id)
    if (!city) {
        throw new NotFoundException(`City with ID ${id} not found`)
    }
    return city
  }

  async updateCity(id: string, updateData: UpdateCityDto): Promise<City> {
    updateData.state = await this.stateService.getState(updateData.stateId)
    const updatedCity = await this.cityRepo.update(id, updateData as any)
    if (!updatedCity) {
        throw new NotFoundException(`City with ID ${id} not found for update`)
    }
    return updatedCity
  }

  async deleteCity(id: string): Promise<void> {
   await this.cityRepo.delete(id)
  }
}