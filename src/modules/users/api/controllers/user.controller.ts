import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AddUserDto } from "../dto/request/add-user.dto";
import { AddUserValidation } from "../validation/add-user.pipe";
import { UserService } from "/users/services/user.service";
import { HashService } from "@Package/auth";

@Controller("users")
export class UserController {
    constructor(
        private readonly userService: UserService, 
    ){}
    @Post()
    async addUser(@Body(AddUserValidation) userData: AddUserDto){
        return await this.userService.createUser(userData)
    }

    @Get('/me')
    async getMe(@Param('id') idParam: string){
        return await this.userService.getMe(idParam)
    }

    @Get()
    async getAll(){
        return await this.userService.getAllUsers()
    }
}