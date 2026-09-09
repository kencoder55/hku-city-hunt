import {
  Crud,
  CrudController,
  CrudRequest,
  GetManyDefaultResponse,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@dataui/crud';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { AdminAuthGuard } from 'src/tools/AdminAuthGuard';
import { covertingPasswordToBcrypt, covertingPasswordToSha1 } from 'src/tools/CommonTools';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Crud({
  model: {
    type: User,
  },
  query: {
    exclude: ['password'],
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
@Controller(['admin/users'])
export class UsersController implements CrudController<User> {
  constructor(public service: UsersService) {}

  get base(): CrudController<User> {
    return this;
  }

  @Get()
  @Override()
  async getMany(@ParsedRequest() crudRequest: CrudRequest) {
    try {
      const response = (await this.base.getManyBase(crudRequest)) as GetManyDefaultResponse<User>;

      let data = response.data;

      // map roles detail
      await this.service.mapRolesDetail(data);

      return response;
    } catch (error) {
      console.error('Get many users error:', error);
      throw error;
    }
  }

  @Get(':id')
  @Override()
  async getOne(@ParsedRequest() crudRequest: CrudRequest) {
    try {
      let data = await this.base.getOneBase(crudRequest);

      // get permission by role ids
      const roles = data.roles as number[];

      // map roles detail
      data.roles = await this.service.getRolesByIds(roles);

      // add permissions
      const permissions = await this.service.getPermissionsByRole(roles);

      const newData = {
        ...data,
        permissions,
      };

      return newData;
    } catch (error) {
      console.error('Get one user error:', error);
      throw error;
    }
  }

  @Post()
  @Override()
  async createOne(@ParsedRequest() crudRequest: CrudRequest, @ParsedBody() dto: CreateUserDto) {
    try {
      // check exist
      await this.service.checkExist({
        username: dto.username,
      });

      // coverting the password to sha1
      dto.password = covertingPasswordToSha1(dto.password);

      return this.base.createOneBase(crudRequest, dto);
    } catch (error) {
      console.error('Create user error:', error);
      throw error;
    }
  }

  @Patch(':id')
  @Override()
  async updateOne(
    @ParsedRequest() crudRequest: CrudRequest,
    @ParsedBody() dto: UpdateUserDto,
    @Param('id') id: number,
  ) {
    try {
      // check exist
      await this.service.checkExist({
        id: id,
        username: dto.username,
      });

      // coverting the password to sha1
      if (dto.password) {
        dto.password = covertingPasswordToBcrypt(dto.password);
      }

      return this.base.updateOneBase(crudRequest, dto);
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  }

  @Delete(':id')
  @Override()
  async deleteOne(@ParsedRequest() crudRequest: CrudRequest, @Req() request: Request) {
    try {
      const data = await this.base.getOneBase(crudRequest);

      // get user from request
      const currentUser = request.user;

      if (!currentUser) {
        throw new BadRequestException('User not found');
      }

      if (currentUser.id === data.id) {
        throw new BadRequestException('You can not delete self user!');
      }

      // add deleted_by
      data.deleted_by = currentUser;

      await this.base.updateOneBase(crudRequest, {
        deleted_by: currentUser.id,
      });

      return this.base.deleteOneBase(crudRequest);
    } catch (error) {
      console.error('Delete user error:', error);
      throw error;
    }
  }

  @Public()
  @Post('login')
  async login(@Body() body: User) {
    try {
      // check username and password
      if (!body.username) {
        throw new BadRequestException('Username is required');
      }

      if (!body.password) {
        throw new BadRequestException('Password is required');
      }

      return await this.service.login(body.username, body.password);
    } catch (error) {
      console.error('User login error:', error);
      throw error;
    }
  }
}
