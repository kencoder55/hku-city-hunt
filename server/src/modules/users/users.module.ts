import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionModules } from '../permissions/permissions.module';
import { RolesModule } from '../roles/roles.module';
import { UserSessionsModule } from '../sessions/user-sessions/user-sessions.module';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UserSessionsModule, PermissionModules, RolesModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
