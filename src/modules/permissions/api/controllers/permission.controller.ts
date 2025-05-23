import { Body, Controller, Delete, Get, Param, Patch, Post, HttpCode, HttpStatus } from "@nestjs/common";
import { PermissionService } from "../../services/permission.service"; // Adjust path
import { CreatePermissionDto } from "../dto/request/create-permission.dto";
import { UpdatePermissionDto } from "../dto/request/update-permission.dto";
import { Permission } from "src/database"; // Adjust path
import { CreatePermissionValidation } from "../validation/create-permission.pipe";
import { UpdatePermissionValidation } from "../validation/update-permission.pipe";

@Controller("permissions")
export class PermissionController {
    constructor(private readonly permissionService: PermissionService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createPermission(@Body(CreatePermissionValidation) permssionData: CreatePermissionDto): Promise<Permission | Permission[]> {
        return await this.permissionService.createPermission(permssionData);
    }

    @Get()
    async getAll(): Promise<Permission[]> {
        return await this.permissionService.getAllPermissions();
    }


        @Get('/drivers')
        // @UserRoleMetadata([UserRole.admin])
        // @UseGuards(JwtAuthGuard, UserRoleGuard)
        async getDrivers(){
            return await this.permissionService.getAllDrivers()
        }

    @Get(':id')
    async getOne(@Param('id') idParam: string): Promise<Permission> {
        return await this.permissionService.getPermission(idParam);
    }

    @Patch(':id')
    async update(
        @Param('id') idParam: string,
        @Body(UpdatePermissionValidation) updateData: UpdatePermissionDto
    ): Promise<Permission> {
        return await this.permissionService.updatePermission(idParam, updateData);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deletePermission(@Param('id') idParam: string): Promise<void> {
     await this.permissionService.deletePermission(idParam);
    }
}