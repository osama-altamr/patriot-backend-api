import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { AddUserDto } from "../dto/request/add-user.dto";
import { AddUserValidation } from "../validation/add-user.pipe";
import { UserService } from "/users/services/user.service";
import { UpdateUserDto } from "../dto/request/update-user.dto";
import { UpdateUserValidation } from "../validation/update-user.pipe";

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
    async getAll(){
        return await this.userService.getAllUsers()
    }

    @Get('/me')
    async getMe(idParam: string){
        return await this.userService.getMe(idParam)
    }
    
    @Patch('/me')
    async updateMe(@Param('id') idParam: string, @Body(UpdateUserValidation) updateData: UpdateUserDto){
        return await this.userService.updateUser(idParam, updateData)
    }

    @Patch(':id')
    async update(@Param('id') idParam: string, @Body(UpdateUserValidation) updateData: UpdateUserDto){
        return await this.userService.updateUser(idParam, updateData)
    }
 

}