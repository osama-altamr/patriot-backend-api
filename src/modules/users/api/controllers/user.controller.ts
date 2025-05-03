import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AddUserDto } from "../dto/request/add-user.dto";
import { AddUserValidation } from "../validation/add-user.pipe";
import { UserService } from "/users/services/user.service";
import { UpdateUserDto } from "../dto/request/update-user.dto";
import { UpdateUserForAdminValidation, UpdateUserValidation } from "../validation/update-user.pipe";
import { JwtAuthGuard } from "@Package/auth";
import { UserRoleGuard } from "@Package/auth/guards";
import { CurrentUser, UserRoleMetadata } from "@Package/api";
import { UserRole } from "../enums/user.enum";
import { User } from "src/database";

@Controller("users")
export class UserController {
    constructor(
        private readonly userService: UserService, 
    ){}

    @Post()
    async addUser(@Body(AddUserValidation) userData: AddUserDto){
        return await this.userService.createUser(userData)
    }

    @Get()
    @UserRoleMetadata([UserRole.admin])
    @UseGuards(JwtAuthGuard, UserRoleGuard)
    async getAll(){
        return await this.userService.getAllUsers()
    }

    @Get('/me')
    @UseGuards(JwtAuthGuard)
    async getMe(@CurrentUser() user: User){
        console.log(user)
        return await this.userService.getMe(user.id)
    }
    
    @Patch('/me')
    @UseGuards(JwtAuthGuard)
    async updateMe(@CurrentUser() user: User, @Body(UpdateUserValidation) updateData: UpdateUserDto){
        return await this.userService.updateUser(user.id, updateData)
    }

    @Patch(':id')
    @UserRoleMetadata([UserRole.admin])
    @UseGuards(JwtAuthGuard, UserRoleGuard)
    async update(@Param('id') idParam: string, @Body(UpdateUserForAdminValidation) updateData: UpdateUserDto){
        return await this.userService.updateUser(idParam, updateData)
    }
 

}