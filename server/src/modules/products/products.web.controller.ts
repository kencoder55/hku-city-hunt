import {
  Crud,
  CrudController,
  CrudRequest,
  GetManyDefaultResponse,
  Override,
  ParsedRequest,
} from '@dataui/crud';
import { Controller, Get, Headers, UseGuards } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { getTranslationField } from 'src/tools/CommonTools';
import { WebAuthGuard } from 'src/tools/WebAuthGuard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@Crud({
  model: {
    type: Product,
  },
  dto: {
    create: CreateProductDto,
    update: UpdateProductDto,
  },
  query: {
    alwaysPaginate: true,
    softDelete: true,
  },
  routes: {
    only: ['getManyBase'],
  },
})
@UseGuards(WebAuthGuard)
@Controller('web/products')
export class ProductsWebController implements CrudController<Product> {
  constructor(public service: ProductsService) {}

  get base(): CrudController<Product> {
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
      )) as GetManyDefaultResponse<Product>;

      const data = response.data;

      const nameField = getTranslationField('name', language || 'en');
      const descField = getTranslationField('description', language || 'en');
      const redemptionDateField = getTranslationField('redemption_date', language || 'en');

      const translatedData = data.map(product => ({
        id: product.id,
        type: product.type,
        name: product[nameField] || product.name_zh || product.name_en,
        description: product[descField] || product.description_zh || product.description_en,
        cover_image: product.cover_image,
        stock: product.stock,
        required_rewards: product.required_rewards,
        redemption_date: product[redemptionDateField] || product.redemption_date_en,
        redemption_link: product.redemption_link,
        created_at: product.created_at,
      }));

      return {
        ...response,
        data: translatedData,
      };
    } catch (error) {
      console.error('Get many products error:', error);
      throw error;
    }
  }
}
