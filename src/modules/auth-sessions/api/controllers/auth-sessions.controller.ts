import { Body, Controller, Post } from "@nestjs/common";
import { LoginDto } from "../dto/request/auth-session.dto";
import { LoginValidation } from "../validation/auth-session.pipe";
import { AuthSessionService } from "/auth-sessions/services/auth-session.service";

@Controller("auth-sessions")
export class AuthSessionController {
    constructor(private readonly authService: AuthSessionService){}
    @Post()
    async login(@Body(LoginValidation) loginData: LoginDto){
        return await this.authService.login(loginData)
    }
}