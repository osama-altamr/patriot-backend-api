import { Body, Controller, Post } from "@nestjs/common";
import { LoginDto } from "../dto/request/refresh-token.dto";
import { LoginValidation } from "../validation/refresh-token.pipe";
import { RefreshTokenService } from "/refresh-tokens/services/refresh-token.service";

@Controller("refresh-tokens")
export class RefreshTokenController {
    constructor(private readonly refreshTokenService: RefreshTokenService){}
}