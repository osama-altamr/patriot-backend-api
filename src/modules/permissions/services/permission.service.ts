import { Injectable, NotFoundException } from '@nestjs/common'
import { PermissionRepository } from '../repository/permission.repository' // Adjust path
import { CreatePermissionDto } from '../api/dto/request/create-permission.dto'
import { UpdatePermissionDto } from '../api/dto/request/update-permission.dto'
import { Permission } from 'src/database' // Adjust path
import { UserRepository } from '/users/repository/user.repository'
import { In } from 'typeorm'

@Injectable()
export class PermissionService {
  constructor(
      private readonly permissionRepo: PermissionRepository,
      private readonly userRepo: UserRepository
    ) {}

  async createPermission(permissionData: CreatePermissionDto): Promise<Permission| Permission[]> {
     const user = await this.userRepo.findOneById(permissionData.userId)
     permissionData.user = user
    return this.permissionRepo.create(permissionData as any)
  }

  async getAllPermissions(): Promise<Permission[]> {
    return this.permissionRepo.findAll({})
  }

  async getPermission(id: string): Promise<Permission | null> {
    const Permission = await this.permissionRepo.findOneById(id)
    if (!Permission) {
        throw new NotFoundException(`Permission with ID ${id} not found`)
    }
    return Permission
  }

  async updatePermission(id: string, updateData: UpdatePermissionDto): Promise<Permission> {
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
}