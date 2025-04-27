import { Body, Controller, Post } from "@nestjs/common";
import { MaterialService } from "/materials/services/material.service";

@Controller("materials")
export class MaterialController {
    constructor(private readonly materialService: MaterialService){}
}