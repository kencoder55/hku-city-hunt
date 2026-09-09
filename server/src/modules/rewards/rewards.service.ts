import { BadRequestException, Injectable } from '@nestjs/common';
import { RedemptionRecordsService } from '../redemption-records/redemption-records.service';
import { RedemptionCodesService } from '../redemption-codes/redemption-codes.service';
import { ProductsService } from '../products/products.service';
import { MemberRewardsService } from '../member-rewards/member-rewards.service';
import { WinstonModule } from 'nest-winston';
import { rewardsWinstonConfig } from 'src/config/winston.config';

const RewardsWinstonLogger = WinstonModule.createLogger(rewardsWinstonConfig);

@Injectable()
export class RewardsService {
  private readonly logger = RewardsWinstonLogger;

  constructor(
    private readonly redemptionRecordsService: RedemptionRecordsService,
    private readonly redemptionCodesService: RedemptionCodesService,
    private readonly productsService: ProductsService,
    private readonly memberRewardsService: MemberRewardsService,
  ) {}

  async redeemProduct(memberId: number, productId: number, password: string) {
    // Validate password
    const correctPassword = process.env.REDEEM_PASSWORD;
    if (password !== correctPassword) {
      throw new BadRequestException('error.password.incorrect');
    }

    // Check if product exists
    const product = await this.productsService.findById(productId);
    if (!product) {
      throw new BadRequestException('error.product.not_found');
    }

    // Check if member has already redeemed this product
    const hasRedeemed = await this.redemptionRecordsService.hasRedeemedProduct(memberId, productId);
    if (hasRedeemed) {
      throw new BadRequestException('error.redemption.already_redeemed');
    }

    // Check if member has enough rewards to unlock this product
    const memberRewards = await this.memberRewardsService.getMemberRewards(memberId);
    const rewardCount = memberRewards.length;

    if (rewardCount < product.required_rewards) {
      throw new BadRequestException('error.redemption.insufficient_rewards');
    }

    // Check stock availability
    if (product.stock <= 0) {
      throw new BadRequestException('error.product.out_of_stock');
    }

    // Reduce stock
    await this.productsService.reduceStock(productId, 1);

    // Create redemption record
    const record = await this.redemptionRecordsService.createRecord({
      member_id: memberId,
      product_id: productId,
      type: product.type,
      remark: `Redeemed product: ${product.name_en || product.name_zh}`,
      redemption_code_id: null,
    });

    return record;
  }

  async redeemCoupon(memberId: number, productId: number) {
    // Check if product exists
    const product = await this.productsService.findById(productId);
    if (!product) {
      throw new BadRequestException('error.product.not_found');
    }

    // Check if member has enough rewards to unlock this product
    const memberRewards = await this.memberRewardsService.getMemberRewards(memberId);
    const rewardCount = memberRewards.length;

    if (rewardCount < product.required_rewards) {
      throw new BadRequestException('error.redemption.insufficient_rewards');
    }

    // Check if member has already redeemed this product
    const existingRecord = await this.redemptionRecordsService.findByMemberAndProduct(
      memberId,
      productId,
    );

    if (existingRecord) {
      // Return existing code
      const existingCode = await this.redemptionCodesService.findById(
        existingRecord.redemption_code_id,
      );

      return {
        code: existingCode.code,
        product: {
          id: product.id,
          name_zh: product.name_zh,
          name_en: product.name_en,
          description_zh: product.description_zh,
          description_en: product.description_en,
          type: product.type,
          coverImage: product.cover_image,
        },
      };
    }

    // Find an available redemption code for this product type
    const availableCode = await this.redemptionCodesService.findAvailableCodeByType(product.type);

    if (!availableCode) {
      // log error to file
      this.logger.error(
        `No available redemption codes for product type ${product.type} when member ${memberId} tried to redeem product ${productId}`,
      );
      throw new BadRequestException('error.redemption.no_available_codes');
    }

    // Mark code as used
    await this.redemptionCodesService.markAsUsed(availableCode.id, null);

    // Create redemption record
    const record = await this.redemptionRecordsService.createRecord({
      member_id: memberId,
      product_id: productId,
      type: product.type,
      remark: `Redeemed coupon: ${product.name_en || product.name_zh}`,
      redemption_code_id: availableCode.id,
    });

    return {
      code: availableCode.code,
      product: {
        id: product.id,
        name_zh: product.name_zh,
        name_en: product.name_en,
        description_zh: product.description_zh,
        description_en: product.description_en,
        type: product.type,
        coverImage: product.cover_image,
      },
    };
  }
}
