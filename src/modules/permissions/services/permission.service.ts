import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { PermissionRepository } from '../repository/permission.repository' // Adjust path
import { CreatePermissionDto } from '../api/dto/request/create-permission.dto'
import { UpdatePermissionDto } from '../api/dto/request/update-permission.dto'
import { Permission } from 'src/database' // Adjust path
import { UserRepository } from '/users/repository/user.repository'
import { In } from 'typeorm'
import { StageRepository } from '/stages/repository/stage.repository'

@Injectable()
export class PermissionService {
  constructor(
    @Inject(forwardRef(() => UserRepository))
    private readonly userRepo: UserRepository,
    private readonly permissionRepo: PermissionRepository,
    private readonly stageRepo: StageRepository
    ) {}

  async createPermission(permissionData: CreatePermissionDto): Promise<Permission| Permission[]> {
     const user = await this.userRepo.findOneById(permissionData.userId)
     let stage
     if(permissionData.stageId){
      stage = await this.stageRepo.findOneById(permissionData.stageId)
     }
     permissionData.user = user
     permissionData.stage = stage
    return await this.permissionRepo.create(permissionData as any)
  }

  async getAllPermissions(){
   return this.permissionRepo.getAllAndCountWithPop()
  }

  async getPermission(id: string): Promise<Permission | null> {
    const Permission = await this.permissionRepo.findOneById(id)
    if (!Permission) {
        throw new NotFoundException(`Permission with ID ${id} not found`)
    }
    return Permission
  }

  async updatePermission(id: string, updateData: UpdatePermissionDto): Promise<Permission> {
    const stage = await this.stageRepo.findOneById(updateData.stageId)
    updateData.stage = stage
    const updatedPermission = await this.permissionRepo.update(id, updateData as any)
    if (!updatedPermission) {
        throw new NotFoundException(`Permission with ID ${id} not found for update`)
    }
    return updatedPermission
  }

  async getAllDrivers() {
    const driverFrompermissions = await this.permissionRepo.getAllDrivers()

    const driverIds = driverFrompermissions.map(driver => driver.user.id)
    return await this.userRepo.findBy({ id: In(driverIds)})
  }

  async deletePermission(id: string): Promise<void> {
   await this.permissionRepo.delete(id)
  }

  async getUserByStage(stageId: string) {
    console.log(stageId)
    const permission = await this.permissionRepo.findOneByWithPop({ stage: { id: stageId }})
   return permission.user
  }
}