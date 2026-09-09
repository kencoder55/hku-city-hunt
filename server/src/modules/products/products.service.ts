import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { RedemptionCode } from '../redemption-codes/entities/redemption-code.entity';

@Injectable()
export class ProductsService extends TypeOrmCrudService<Product> {
  constructor(
    @InjectRepository(Product)
    repo: Repository<Product>,
    @InjectRepository(RedemptionCode)
    private readonly redemptionCodeRepo: Repository<RedemptionCode>,
  ) {
    super(repo);
  }

  async findById(id: number): Promise<Product> {
    return await this.repo.findOne({ where: { id } });
  }

  async countAvailableCodesByType(type: string): Promise<number> {
    return await this.redemptionCodeRepo.count({
      where: { type, is_used: false },
    });
  }

  async reduceStock(productId: number, quantity: number = 1): Promise<Product> {
    const product = await this.findById(productId);

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.stock < quantity) {
      throw new Error('Insufficient stock');
    }

    product.stock -= quantity;
    return await this.repo.save(product);
  }
}
