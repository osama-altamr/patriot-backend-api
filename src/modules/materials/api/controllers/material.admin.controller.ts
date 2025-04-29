import { Body, Controller, Post } from "@nestjs/common";
import { MaterialService } from "/materials/services/material.service";
import { AuthControllerAdmin } from "@Package/api";

@AuthControllerAdmin({
    prefix: "materials"
})
export class MaterialController {
    constructor(private readonly materialService: MaterialService){}
}