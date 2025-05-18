import { IUser, User } from "src/database";
import { PartialType } from "@nestjs/swagger"

export class UpdateUserDto extends PartialType(User) {

}
