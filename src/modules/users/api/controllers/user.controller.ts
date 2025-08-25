import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
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
import { ForgotPasswordValidation } from "../validation/forgot-password.pipe";
import { ForgotPasswordDto } from "../dto/request/forgot-password.dto";
import { ResetPasswordDto } from "../dto/request/reset-password.dto";
import { ResetPasswordValidation } from "../validation/reset-password.pipe";
import { UpdatePasswordValidation } from "../validation/update-password.pipe";
import { UpdatePasswordDto } from "../dto/request/update-password.dto";
import { GetAllUsersValidation } from "../validation/get-all.pipe";
import { GetAllUsersDto } from "../dto/request/get-all.dto";
import { parseQuery } from "@Package/api/functions";
import { RefreshTokenRepository } from "/refresh-tokens/repository/refresh-token.repository";

@Controller("users")
export class UserController {
    constructor(
        private readonly userService: UserService, 
        private readonly refreshTokenRepo: RefreshTokenRepository, 
    ){}

    @Post()
    async addUser(@Body(AddUserValidation) userData: AddUserDto){
        return await this.userService.createUser(userData)
    }

    @Get()
    // @UserRoleMetadata([UserRole.admin])
    // @UseGuards(JwtAuthGuard, UserRoleGuard)
    async getAll(@Query(GetAllUsersValidation) query: GetAllUsersDto){
        const { pagination, myQuery } = parseQuery(query)
      return await this.userService.getAllUsers(myQuery, pagination)
    }

    @Get('/me')
    @UseGuards(JwtAuthGuard)
    async getMe(@CurrentUser() user: User){
        console.log(user)
        return await this.userService.getMe(user.id)
    }

    @Get(':id')
    // @UseGuards(JwtAuthGuard)
    async getOne(@Param('id') idParam: string){
        return await this.userService.getMe(idParam)
    }
    
    @Patch('/me')
    @UseGuards(JwtAuthGuard)
    async updateMe(@CurrentUser() user: User, @Body(UpdateUserValidation) updateData: UpdateUserDto){
        return await this.userService.updateUser(user.id, updateData)
    }

    @Patch(':id')
    // @UserRoleMetadata([UserRole.admin])
    // @UseGuards(JwtAuthGuard, UserRoleGuard)
    async update(@Param('id') idParam: string, @Body(UpdateUserForAdminValidation) updateData: UpdateUserDto){
        return await this.userService.updateUser(idParam, updateData)
    }
 

    @Post('forgot-password')
    async forgotPassword(@Body(ForgotPasswordValidation) reqData: ForgotPasswordDto){
        return await this.userService.forgotPassword(reqData.email)
    }
 
    @Post('reset-password')
    async resetPassword(@Body(ResetPasswordValidation) reqData: ResetPasswordDto){
        return await this.userService.resetPassword(reqData)
    }

    @Post('update-password')
    @UseGuards(JwtAuthGuard)
    async updatePassword(
        @CurrentUser() user: User,
        @Body(UpdatePasswordValidation) reqData: UpdatePasswordDto){
        return await this.userService.updatePassword(user.id,reqData)
    }

    @Delete(':id')
    async delete(@Param('id') id: string){
        const refreshTokens = await this.refreshTokenRepo.findBy({
            user: {id: id}
        })
        for(const rf of refreshTokens) {
            await this.refreshTokenRepo.delete(rf.id)
        }
        return await this.userService.forceDelete(id)
    }
}