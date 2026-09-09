import {
  Crud,
  CrudController,
  CrudRequest,
  GetManyDefaultResponse,
  Override,
  ParsedRequest,
} from '@dataui/crud';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { createFileInterceptor } from 'src/interceptor/LocalFileInterceptor';
import { getTranslationField } from 'src/tools/CommonTools';
import { WebAuthGuard } from 'src/tools/WebAuthGuard';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
import { Mission } from './entities/mission.entity';
import { MissionsService } from './missions.service';

@Crud({
  model: {
    type: Mission,
  },
  dto: {
    create: CreateMissionDto,
    update: UpdateMissionDto,
  },
  query: {
    alwaysPaginate: true,
  },
  routes: {
    only: ['getOneBase', 'getManyBase'],
  },
})
@UseGuards(WebAuthGuard)
@Controller('web/missions')
export class MissionsWebController implements CrudController<Mission> {
  constructor(public service: MissionsService) {}

  get base(): CrudController<Mission> {
    return this;
  }

  @Public()
  @Get()
  @Override()
  async getMany(
    @ParsedRequest() crudRequest: CrudRequest,
    @Headers('accept-language') language: string,
  ) {
    try {
      const response = (await this.base.getManyBase(
        crudRequest,
      )) as GetManyDefaultResponse<Mission>;

      // Use cache if no custom filters are applied (standard load from members)
      const hasCustomFilters =
        crudRequest.parsed.filter?.length > 0 ||
        crudRequest.parsed.or?.length > 0 ||
        crudRequest.parsed.search !== undefined;

      let data: Mission[];
      if (!hasCustomFilters) {
        data = await this.service.findAllCached();
      } else {
        data = response.data;
      }

      const nameField = getTranslationField('name', language || 'en');
      const descField = getTranslationField('description', language || 'en');
      const wellnessField = getTranslationField('wellness_message', language || 'en');
      const addressField = getTranslationField('address', language || 'en');

      const translatedData = data.map(mission => ({
        id: mission.id,
        slug: mission.slug,
        code: mission.code,
        name: mission[nameField] || mission.name_zh || mission.name_en,
        type: mission.type,
        description: mission[descField] || mission.description_zh || mission.description_en,
        wellness_message:
          mission[wellnessField] || mission.wellness_message_zh || mission.wellness_message_en,
        address: mission[addressField] || mission.address_zh || mission.address_en,
        cover_image: mission.cover_image,
        start_time: mission.start_time,
        end_time: mission.end_time,
        category: mission.category,
        location: mission.location,
        parameter: mission.parameter,
      }));

      return {
        ...response,
        data: translatedData,
      };
    } catch (error) {
      console.error('Get many missions error:', error);
      throw error;
    }
  }

  @Public()
  @Get(':slug')
  async getMissionBySlug(
    @Param('slug') slug: string,
    @Headers('accept-language') language: string,
  ): Promise<any> {
    const mission = await this.service.findBySlug(slug);
    console.log('Requested mission slug:', slug, 'Found mission:', mission);

    if (!mission) {
      return null;
    }

    const nameField = getTranslationField('name', language || 'en');
    const descField = getTranslationField('description', language || 'en');
    const wellnessField = getTranslationField('wellness_message', language || 'en');
    const addressField = getTranslationField('address', language || 'en');

    return {
      id: mission.id,
      slug: mission.slug,
      code: mission.code,
      name: mission[nameField] || mission.name_zh || mission.name_en,
      type: mission.type,
      description: mission[descField] || mission.description_zh || mission.description_en,
      wellness_message:
        mission[wellnessField] || mission.wellness_message_zh || mission.wellness_message_en,
      address: mission[addressField] || mission.address_zh || mission.address_en,
      cover_image: mission.cover_image,
      start_time: mission.start_time,
      end_time: mission.end_time,
      category: mission.category,
      location: mission.location,
      parameter: mission.parameter,
    };
  }

  @Post(':slug/finish')
  async finishMission(
    @Req() request: Request,
    @Param('slug') slug: string,
    @Body('result') result: any,
  ) {
    if (!slug) {
      throw new BadRequestException('error.mission_slug_required');
    }

    // find mission by slug
    const mission = await this.service.findBySlug(slug);

    if (!mission) {
      throw new BadRequestException('error.mission_not_found');
    }

    // get member from request
    const member = request.member;

    if (!member) {
      throw new BadRequestException('error.member.not_found');
    }

    return this.service.finishMission(mission, member.id, result);
  }

  @Post('upload-photo')
  @UseInterceptors(
    createFileInterceptor(
      `missions/${new Date().toISOString().split('T')[0]}`,
      'image',
      undefined,
      false,
    ),
  )
  async uploadPhoto(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('error.no_files_uploaded');
    }

    console.log('Uploaded files:', files);

    const file = files[0];

    const url = `${process.env.BASE_URL}/${file.path}`;

    return url;
  }
}
