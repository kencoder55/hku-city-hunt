import { Crud, CrudController, CrudRequest, Override, ParsedBody, ParsedRequest } from '@dataui/crud';
import { BadRequestException, Controller, Delete, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AdminAuthGuard } from 'src/tools/AdminAuthGuard';
import { Role } from './entities/role.entity';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
@Crud({
  model: {
    type: Role,
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
@Controller('admin/roles')
export class RolesController implements CrudController<Role> {
  constructor(public service: RolesService) { }

  get base(): CrudController<Role> {
    return this;
  }

  @Post()
  @Override()
  async createOne(
    @ParsedRequest() crudRequest: CrudRequest,
    @ParsedBody() dto: CreateRoleDto,
  ) {
    try {
      // check exist
      await this.service.checkExist({
        name: dto.name,
      });

      return this.base.createOneBase(crudRequest, dto);
    } catch (error) {
      console.error('Create role error:', error);
      throw error;
    }
  }

  @Patch(':id')
  @Override()
  async updateOne(
    @ParsedRequest() crudRequest: CrudRequest,
    @ParsedBody() dto: UpdateRoleDto,
    @Param('id') id: number
  ) {
    try {
      // check exist
      await this.service.checkExist({
        id: id,
        name: dto.name,
      });

      return this.base.updateOneBase(crudRequest, dto);
    } catch (error) {
      console.error('Update role error:', error);
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
      console.error('Delete role error:', error);
      throw error;
    }
  }
}