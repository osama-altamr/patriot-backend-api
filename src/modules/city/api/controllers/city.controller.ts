// FILE: src/api/controllers/city.controller.ts

import { Body, Controller, Delete, Get, Param, Patch, Post, HttpCode, HttpStatus, Query } from "@nestjs/common";
import { CityService } from "../../services/city.service"; // Adjust path
import { CreateCityDto } from "../dto/request/create-city.dto";
import { UpdateCityDto } from "../dto/request/update-city.dto";
import { City } from "src/database"; // Adjust path
import { CreateCityValidation } from "../validation/create-city.pipe";
import { UpdateCityValidation } from "../validation/update-city.pipe";

@Controller("cities")
export class CityController {
    constructor(private readonly cityService: CityService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createCity(@Body(CreateCityValidation) cityData: CreateCityDto): Promise<City | City[]> {
        return await this.cityService.createCity(cityData);
    }

    @Get()
    async getAll(@Query('search') search?: string){
        return await this.cityService.getAllCities(search);
    }

    @Get(':id')
    async getOne(@Param('id') idParam: string): Promise<City> {
        return await this.cityService.getCity(idParam);
    }

    @Patch(':id')
    async update(
        @Param('id') idParam: string,
        @Body(UpdateCityValidation) updateData: UpdateCityDto
    ): Promise<City> {
        return await this.cityService.updateCity(idParam, updateData);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteCity(@Param('id') idParam: string): Promise<void> {
     await this.cityService.deleteCity(idParam);
    }
}