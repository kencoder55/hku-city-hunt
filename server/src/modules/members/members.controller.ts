import {
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@dataui/crud';
import {
  BadRequestException,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AdminAuthGuard } from 'src/tools/AdminAuthGuard';
import { covertingPasswordToSha1 } from 'src/tools/CommonTools';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { Member } from './entities/member.entity';
import { MembersService } from './members.service';

@Crud({
  model: {
    type: Member,
  },
  dto: {
    create: CreateMemberDto,
    update: UpdateMemberDto,
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
  routes: {},
})
@UseGuards(AdminAuthGuard)
@Controller('admin/members')
export class MembersController implements CrudController<Member> {
  constructor(public service: MembersService) {}

  get base(): CrudController<Member> {
    return this;
  }

  @Post()
  @Override()
  async createOne(@ParsedRequest() crudRequest: CrudRequest, @ParsedBody() dto: CreateMemberDto) {
    try {
      await this.service.checkEmailExist({
        email: dto.email,
      });

      await this.service.checkPhoneExist({
        phone: dto.phone,
      });

      dto.password = covertingPasswordToSha1(dto.password);
      dto.is_email_verified = true;
      dto.is_sms_verified = true;
      dto.is_blocked = false;

      return this.base.createOneBase(crudRequest, dto);
    } catch (error) {
      console.error('Create member error:', error);
      throw error;
    }
  }

  @Patch(':id')
  @Override()
  async updateOne(
    @ParsedRequest() crudRequest: CrudRequest,
    @ParsedBody() dto: UpdateMemberDto,
    @Param('id') id: number,
  ) {
    try {
      await this.service.checkEmailExist({
        id: id,
        email: dto.email,
      });

      await this.service.checkPhoneExist({
        id: id,
        phone: dto.phone,
      });

      if (dto.password) {
        dto.password = covertingPasswordToSha1(dto.password);
      }

      return this.base.updateOneBase(crudRequest, dto);
    } catch (error) {
      console.error('Update member error:', error);
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

      // add deleted_by
      data.deleted_by = currentUser;

      await this.base.updateOneBase(crudRequest, {
        deleted_by: currentUser.id,
      });

      return this.base.deleteOneBase(crudRequest);
    } catch (error) {
      console.error('Delete member error:', error);
      throw error;
    }
  }
}
