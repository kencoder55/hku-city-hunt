import { Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@dataui/crud';
import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AdminAuthGuard } from 'src/tools/AdminAuthGuard';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { SavePermissionDto } from './dto/save-permission.dto';
import { Permission } from './entities/permission.entity';
import { PermissionsService } from './permissions.service';
@Crud({
  model: {
    type: Permission,
  },
  query: {
    alwaysPaginate: true,
    softDelete: true,
    join: {
      role_id_info: {
        eager: true,
        allow: ['id', 'name'],
      },
      created_by: {
        eager: true,
        allow: ['id', 'username'],
      },
      updated_by: {
        eager: true,
        allow: ['id', 'username'],
      },
    },
  },
  routes: {
    // exclude api actions eg:
    // exclude: ['deleteOneBase'],
  },
})
@UseGuards(AdminAuthGuard)
@Controller('admin/permissions')
export class PermissionsController implements CrudController<Permission> {
  constructor(public service: PermissionsService) { }

  get base(): CrudController<Permission> {
    return this;
  }

  @Delete(':id')
  @Override()
  async deleteOne(
    @ParsedRequest() crudRequest: CrudRequest,
    @Req() request: Request
  ) {
    try {
      const data = await this.base.getOneBase(crudRequest);

      // get user from request
      const currentUser = request.user;

      if (!currentUser) {
        throw new BadRequestException('User not found');
      }

      // add deleted_by
      data.deleted_by = currentUser;

      await this.base.updateOneBase(crudRequest, {
        deleted_by: currentUser.id,
      });

      return this.base.deleteOneBase(crudRequest);
    } catch (error) {
      console.error('Delete permission error:', error);
      throw error;
    }
  }

  @Patch('save')
  async save(
    @Req() request: Request,
    @Body() body: SavePermissionDto,
  ) {
    try {
      const roleId = body.role_id;

      const permission = body.permission;

      // get user from request
      const currentUser = request.user;
      if (!currentUser) {
        throw new BadRequestException('User not found');
      }

      return await this.service.savePermission(roleId, permission, currentUser);
    } catch (error) {
      console.error('Save permission error:', error);
      throw error;
    }
  }

  @Get('getPermissionDetails/:id')
  async getPermissionDetails(@Param('id') id: number) {
    try {
      return await this.service.getPermissionDetails(id);
    } catch (error) {
      console.error('Get permission details error:', error);
      throw error;
    }
  }
}
