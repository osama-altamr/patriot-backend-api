import { Module } from '@nestjs/common'
import { EnvConfigModule } from '@Package/config'
import { DatabaseModule } from './database/database.module'
import { UserModule } from '/users/user.module'
import { AuthSessionModule } from '/auth-sessions/auth-session.module'
import { AuthModule } from '/auth/auth.module'
import { RefreshTokenModule } from '/refresh-tokens/refresh-token.module'
import { StageModule } from '/stages/stage.module'
import { ProductModule } from '/products/product.module'
import { ComplaintModule } from '/complaints/complaint.module'
import { JWTModule } from '@Package/auth'


@Module({
  imports: [
    EnvConfigModule,
    DatabaseModule,
    AuthModule,
    UserModule,
    AuthSessionModule,
    RefreshTokenModule,
    StageModule,
    ProductModule,
    ComplaintModule,
  ],
})
export class AppModule {}
