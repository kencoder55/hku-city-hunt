import { Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@dataui/crud';
import { BadRequestException, Controller, Delete, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AdminAuthGuard } from 'src/tools/AdminAuthGuard';
import { CreatePermissionModuleDto } from './dto/create-permission_module.dto';
import { UpdatePermissionModuleDto } from './dto/update-permission_module.dto';
import { PermissionModule } from './entities/permission-module.entity';
import { PermissionModulesService } from './permission-modules.service';
import { User } from '../users/entities/user.entity';

@Crud({
  model: {
    type: PermissionModule,
  },
  query: {
    alwaysPaginate: true,
    softDelete: true,
    join: {
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
@Controller('admin/permission-modules')
export class PermissionModulesController implements CrudController<PermissionModule> {
  constructor(public service: PermissionModulesService) { }

  get base(): CrudController<PermissionModule> {
    return this;
  }

  @Post()
  @Override()
  async createOne(
    @ParsedRequest() crudRequest: CrudRequest,
    @ParsedBody() dto: CreatePermissionModuleDto,
  ) {
    try {
      // check exist
      await this.service.checkExist({
        module: dto.module,
      });

      return this.base.createOneBase(crudRequest, dto);
    } catch (error) {
      console.error('Create permission module error:', error);
      throw error;
    }
  }

  @Patch(':id')
  @Override()
  async updateOne(
    @ParsedRequest() crudRequest: CrudRequest,
    @ParsedBody() dto: UpdatePermissionModuleDto,
    @Param('id') id: number
  ) {
    try {
      // check exist
      await this.service.checkExist({
        id: id,
        module: dto.module,
      });

      return this.base.updateOneBase(crudRequest, dto);
    } catch (error) {
      console.error('Update permission module error:', error);
      throw error;
    }
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
      console.error('Delete permission module error:', error);
      throw error;
    }
  }

  @Delete('/deleteByModule/:module')
  @Override()
  async deleteOneByModule(
    @ParsedRequest() crudRequest: CrudRequest,
    @Req() request: Request,
    @Param('module') module: string
  ) {
    try {
      // get user from request
      const currentUser = request.user as User;

      if (!currentUser) {
        throw new BadRequestException('User not found');
      }

      // find record
      const record = await this.service.findOne({
        where: {
          module: module,
        },
      });

      if (!record) {
        throw new BadRequestException('Permission module not found');
      }

      const id = record.id;

      // add deleted_by
      await this.service.updateDeletedBy(id, currentUser);

      return this.service.deleteOneByModule(id);
    } catch (error) {
      console.error('Delete permission module by module error:', error);
      throw error;
    }
  }
}
