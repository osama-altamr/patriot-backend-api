import { Body, Controller, Post } from "@nestjs/common";
import { AddUserDto } from "../dto/request/add-user.dto";
import { AddUserValidation } from "../validation/add-user.pipe";
import { UserService } from "/users/services/user.service";


@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService){}
    @Post("")
    async addUser(@Body(AddUserValidation) userData: AddUserDto){
        return await this.userService.createUser(userData)
    }
}