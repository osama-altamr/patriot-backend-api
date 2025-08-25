// FILE: src/services/state.service.ts

import { Injectable, NotFoundException } from '@nestjs/common'
import { StateRepository } from '../repository/state.repository' // Adjust path
import { CreateStateDto } from '../api/dto/request/create-state.dto'
import { UpdateStateDto } from '../api/dto/request/update-state.dto'
import { State } from 'src/database' // Adjust path
import { Pagination, QueryValue } from '@Package/api'
import { GetAllStatesDto } from '../api/dto/request/get-all.dto'

@Injectable()
export class StateService {
  constructor(
      private readonly stateRepo: StateRepository,
    ) {}

  async createState(stateData: CreateStateDto): Promise<State | State[]> {
    return this.stateRepo.create(stateData as any)
  }

  async getAllStates(query: QueryValue<GetAllStatesDto>, pagination: Pagination){
    return this.stateRepo.getAllStates(query, pagination)
  }

  async getState(id: string): Promise<State | null> {
    const state = await this.stateRepo.findOneById(id)
    if (!state) {
        throw new NotFoundException(`State with ID ${id} not found`)
    }
    return state
  }

  async updateState(id: string, updateData: UpdateStateDto): Promise<State> {
    const updatedState = await this.stateRepo.update(id, updateData as any)
    if (!updatedState) {
        throw new NotFoundException(`State with ID ${id} not found for update`)
    }
    return updatedState
  }

  async deleteState(id: string): Promise<void> {
   await this.stateRepo.delete(id)
  }
}