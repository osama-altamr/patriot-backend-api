import { Body, Post } from "@nestjs/common";
import { AuthControllerAdmin, ControllerAdmin } from "@Package/api";
import { AuthService } from "/auth/services/auth.service";
import { UserPayload } from "@Package/auth";

@ControllerAdmin({
    prefix: "auth"
})
export class AuthAdminController {

    constructor(
        private readonly authService: AuthService,
    ){}

    @Post("")
    async generateToken(@Body() body: UserPayload){
        return this.authService.generateAccessToken(body)
    }
}