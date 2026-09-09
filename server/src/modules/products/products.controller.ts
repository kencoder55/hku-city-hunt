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
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminAuthGuard } from 'src/tools/AdminAuthGuard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';
import { createFileInterceptor } from 'src/interceptor/LocalFileInterceptor';
import { S3Service } from '../s3/s3.service';
import { generateS3Key } from 'src/tools/S3Tools';
import { Request } from 'express';

@Crud({
  model: {
    type: Product,
  },
  dto: {
    create: CreateProductDto,
    update: UpdateProductDto,
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
})
@UseGuards(AdminAuthGuard)
@Controller('admin/products')
export class ProductsController implements CrudController<Product> {
  constructor(
    public service: ProductsService,
    private readonly s3Service: S3Service,
  ) {}

  get base(): CrudController<Product> {
    return this;
  }

  @Get(':id')
  @Override()
  async getOne(@ParsedRequest() crudRequest: CrudRequest) {
    try {
      const product = await this.base.getOneBase(crudRequest);

      if (product && product.type !== 'product') {
        product.stock = await this.service.countAvailableCodesByType(product.type);
      }

      return product;
    } catch (error) {
      console.error('Get one user error:', error);
      throw error;
    }
  }

  @Post()
  @Override()
  @UseInterceptors(createFileInterceptor('/products/cover-image', 'image', undefined, true))
  async createOne(
    @Req() request: Request,
    @UploadedFiles()
    files: Express.Multer.File[],
    @ParsedRequest() crudRequest: CrudRequest,
    @ParsedBody() dto: CreateProductDto,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Image is required');
    }

    const key = generateS3Key('products/cover-image', files[0].originalname);
    const url = await this.s3Service.uploadFile(files[0].buffer, key, files[0].mimetype);

    dto.cover_image = url;
    dto.created_by = request.user;
    dto.updated_by = request.user;

    return this.base.createOneBase(crudRequest, dto);
  }

  @Patch(':id')
  @Override()
  @UseInterceptors(createFileInterceptor('/products/cover-image', 'image', undefined, true))
  async updateOne(
    @Req() request: Request,
    @UploadedFiles()
    files: Express.Multer.File[],
    @ParsedRequest() crudRequest: CrudRequest,
    @ParsedBody() dto: UpdateProductDto,
    @Param('id') id: number,
  ) {
    if (files && files.length > 0) {
      const key = generateS3Key('products/cover-image', files[0].originalname);
      dto.cover_image = await this.s3Service.uploadFile(files[0].buffer, key, files[0].mimetype);
    }

    dto.updated_by = request.user;

    return this.base.updateOneBase(crudRequest, dto);
  }
}
