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
import { MaterialModule } from '/materials/material.module'
import { CategoryModule } from '/categories/category.module'
import { OrdersModule } from '/orders/orders.module'
import { PermissionModule } from '/permissions/permission.module'
import { MailerModule } from '/mailer/mailer.module'
import { NotificationModule } from '/notifications/notification.module'
import { HomeModule } from '/home/home.module'
import { AWSModule } from '/aws/aws.module'
import { ProductReviewModule } from '/product-reviews/product-review.module'
import { ReportModule } from '/reports/report.module'
import { StateModule } from '/states/state.module'
import { CityModule } from '/city/city.module'
import { FavoriteModule } from '/favorites/favorite.module'
import { StagePatternModule } from '/stage-pattern/stage-pattern.module'

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
    MaterialModule,
    MailerModule,
    CategoryModule,
    PermissionModule,
    OrdersModule,
    NotificationModule,
    HomeModule,
    AWSModule,
    ProductReviewModule,
    ReportModule,
    StateModule,
    CityModule,
    FavoriteModule,
    StagePatternModule,
  ],
})
export class AppModule {}
