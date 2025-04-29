import * as bcrypt from "bcryptjs"

const Salt = 10

export class HashService {

  public static async hashPassword(data: string){
    return await bcrypt.hash(data,Salt)
  }

  public static async comparePassword(plainPassword: string, hashedPassword: string) {
    return await bcrypt.compare(plainPassword, hashedPassword)
  }
}