import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSessionsModule } from '../sessions/user-sessions/user-sessions.module';
import { PermissionModule } from './entities/permission-module.entity';
import { PermissionModulesController } from './permission-modules.controller';
import { PermissionModulesService } from './permission-modules.service';

@Module({
  imports: [TypeOrmModule.forFeature([PermissionModule]), UserSessionsModule],
  controllers: [PermissionModulesController],
  providers: [PermissionModulesService],
})
export class PermissionModuleModules {}
