import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberSessionsModule } from '../sessions/member-sessions/member-sessions.module';
import { UserSessionsModule } from '../sessions/user-sessions/user-sessions.module';
import { Product } from './entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsWebController } from './products.web.controller';
import { S3Module } from '../s3/s3.module';
import { RedemptionCode } from '../redemption-codes/entities/redemption-code.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, RedemptionCode]),
    UserSessionsModule,
    MemberSessionsModule,
    S3Module,
  ],
  controllers: [ProductsController, ProductsWebController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
