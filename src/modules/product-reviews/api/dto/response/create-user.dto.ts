import { User } from "src/database";

export class CreateUserReponse {
    id: string;
    name: string
    constructor (user: User) {
      this.id = user.id.toString()
    }
}