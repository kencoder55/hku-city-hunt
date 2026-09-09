import { PartialType } from '@nestjs/swagger';
import { CreatePermissionModuleDto } from './create-permission_module.dto';

export class UpdatePermissionModuleDto extends PartialType(CreatePermissionModuleDto) {}
