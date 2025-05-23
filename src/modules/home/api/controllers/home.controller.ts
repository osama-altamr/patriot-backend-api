import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { HomeService } from "/home/services/home.service";
import { JwtAuthGuard } from "@Package/auth";
import { CurrentUser } from "@Package/api";
import { User } from "src/database";

@Controller("home")
export class HomeController {
    constructor(private readonly homeService: HomeService){}
    
    @Get('/statistics')
    async getStatistics(){
        return await this.homeService.getStatistics()
    }

    @Get('/me/statistics')
        @UseGuards(JwtAuthGuard)
    async getStatisticsMe(@CurrentUser() user: User){
        return await this.homeService.getStatisticsMe(user.id)
    }
}