
import * as bcrypt from "bcryptjs"
import * as mCrypto from 'crypto'

const Salt = 10

export class HashService {

 static pepperify = (str: string): string =>
  mCrypto
    .createHmac('sha1', '496ba1dd1953e309d528370d96dd6e6f0bbbf693759a54f9')
    .update(str)
    .digest('hex')
    
  public static async hashPassword(password: string){
    return await bcrypt.hash(this.pepperify(password), Salt)
  }

  public static async comparePasswords(plaintext: string, ciphertext: string): Promise<boolean>{
    return await bcrypt.compare(this.pepperify(plaintext), ciphertext)
  }

}