import { Body, Controller, Delete, Get, Param, Patch, Post, HttpCode, HttpStatus } from "@nestjs/common";
import { StateService } from "../../services/state.service"; // Adjust path
import { CreateStateDto } from "../dto/request/create-state.dto";
import { UpdateStateDto } from "../dto/request/update-state.dto";
import { State } from "src/database"; // Adjust path
import { CreateStateValidation } from "../validation/create-state.pipe";
import { UpdateStateValidation } from "../validation/update-state.pipe";

@Controller("states")
export class StateController {
    constructor(private readonly stateService: StateService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createState(@Body(CreateStateValidation) stateData: CreateStateDto): Promise<State | State[]> {
        return await this.stateService.createState(stateData);
    }

    @Get()
    async getAll(): Promise<State[]> {
        return await this.stateService.getAllStates();
    }

    @Get(':id')
    async getOne(@Param('id') idParam: string): Promise<State> {
        return await this.stateService.getState(idParam);
    }

    @Patch(':id')
    async update(
        @Param('id') idParam: string,
        @Body(UpdateStateValidation) updateData: UpdateStateDto
    ): Promise<State> {
        return await this.stateService.updateState(idParam, updateData);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteState(@Param('id') idParam: string): Promise<void> {
     await this.stateService.deleteState(idParam);
    }
}

