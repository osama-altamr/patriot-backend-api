import { Body, Controller, Post } from "@nestjs/common";
import { LoginDto } from "../dto/request/login.dto";
import { LoginValidation } from "../validation/login.pipe";
import { AuthSessionService } from "/auth-sessions/services/auth-session.service";
import { RefreshDto } from "../dto/request/refresh.dto";
import { RefreshValidation } from "../validation/refresh.pipe";

@Controller("auth-sessions")
export class AuthSessionController {
    constructor(private readonly authService: AuthSessionService){}
    
    @Post('/email')
    async login(@Body(LoginValidation) loginData: LoginDto){
        return await this.authService.login(loginData)
    }

    @Post('/refresh')
    async refresh(@Body(RefreshValidation) refreshData: RefreshDto){
        return await this.authService.refresh(refreshData)
    }
}