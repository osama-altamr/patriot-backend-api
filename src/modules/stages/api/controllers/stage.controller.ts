import { Body, Controller, Post } from "@nestjs/common";
import { StageService } from "/stages/services/stage.service";

@Controller("stages")
export class StageController {
    constructor(private readonly stageService: StageService){}
}