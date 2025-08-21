import { Body, Controller, Delete, Get, Param, Post, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { CreateFavoriteDto } from "../dto/request/create-favorite.dto";
import { CreateFavoriteValidation } from "../validation/create-favorite.pipe";
import { Favorite, User } from "src/database"; // Adjust path
import { FavoriteService } from "/favorites/services/favorite.service";
import { CurrentUser } from "@Package/api";
import { JwtAuthGuard } from "@Package/auth";

@Controller("favorites")
export class FavoriteController {
    constructor(private readonly favoriteService: FavoriteService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(JwtAuthGuard)
    async addFavorite(
        @CurrentUser() user: User,
        @Body(CreateFavoriteValidation) favoriteData: CreateFavoriteDto,
    ): Promise<Favorite> {
        return await this.favoriteService.addFavorite(user.id, favoriteData);
    }
    @Get()
    @UseGuards(JwtAuthGuard)
    async getMyFavorites(
        @CurrentUser() user: User,
    ){
        const data = await this.favoriteService.getUserFavorites(user.id);
        return {
            results: data,
            total: data.length
        }
    }

    @Delete(':productId')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async removeFavorite(
        @CurrentUser() user: User,
        @Param('productId') productId: string,
    ): Promise<void> {
        await this.favoriteService.removeFavorite(user.id, productId);
    }
}