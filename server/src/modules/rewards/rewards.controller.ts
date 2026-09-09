import { BadRequestException, Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { WebAuthGuard } from 'src/tools/WebAuthGuard';
import { RewardsService } from './rewards.service';
import { RedemptionCodesService } from '../redemption-codes/redemption-codes.service';
import { MissionRecordsService } from '../mission-records/mission-records.service';
import { MemberRewardsService } from '../member-rewards/member-rewards.service';
import { MissionsService } from '../missions/missions.service';

@UseGuards(WebAuthGuard)
@Controller('web/rewards')
export class RewardsController {
  constructor(
    private readonly rewardsService: RewardsService,
    private readonly redemptionCodesService: RedemptionCodesService,
    private readonly missionRecordsService: MissionRecordsService,
    private readonly memberRewardsService: MemberRewardsService,
    private readonly missionsService: MissionsService,
  ) {}

  @Post('redeem-product')
  async redeemProduct(
    @Req() request: Request,
    @Body('product_id') productId: number,
    @Body('password') password: string,
  ) {
    const member = request.member;

    if (!member || !member.id) {
      throw new BadRequestException('error.member.not_authenticated');
    }

    if (!productId) {
      throw new BadRequestException('error.product.id_required');
    }

    if (!password) {
      throw new BadRequestException('error.password.required');
    }

    return this.rewardsService.redeemProduct(member.id, productId, password);
  }

  @Post('redeem-coupon')
  async redeemCoupon(@Req() request: Request, @Body('product_id') productId: number) {
    const member = request.member;

    if (!member || !member.id) {
      throw new BadRequestException('error.member.not_authenticated');
    }

    if (!productId) {
      throw new BadRequestException('error.product.id_required');
    }

    return this.rewardsService.redeemCoupon(member.id, productId);
  }

  @Post('redeem-code')
  async redeemCode(
    @Req() request: Request,
    @Body('code') code: string,
    @Body('type') type: string,
  ) {
    const member = request.member;

    if (!member || !member.id) {
      throw new BadRequestException('error.member.not_authenticated');
    }

    if (!code) {
      throw new BadRequestException('error.code.required');
    }

    if (!type) {
      throw new BadRequestException('error.type.required');
    }

    // Find redemption code
    const redemptionCode = await this.redemptionCodesService.findByCode(code);

    if (!redemptionCode) {
      throw new BadRequestException('error.redemption_code.not_found');
    }

    // Check if type matches
    if (redemptionCode.type !== type) {
      throw new BadRequestException('error.redemption_code.invalid_type');
    }

    // Check if already used (except for eslite which can be reused)
    if (redemptionCode.is_used && redemptionCode.type !== 'eslite') {
      throw new BadRequestException('error.redemption_code.already_used');
    }

    // Find the mission by type
    const mission = await this.missionsService.findByType(type);

    if (!mission) {
      throw new BadRequestException('error.mission.not_found');
    }

    // Create mission record
    console.log('Mission parameter:', mission.parameter);
    const missionParameter =
      typeof mission.parameter === 'string'
        ? JSON.parse(mission.parameter)
        : mission.parameter || {};

    const missionRecord = await this.missionRecordsService.insertMissionRecord(mission, member.id, {
      ...missionParameter,
      redemption_code: code,
    });

    // Check if this is the first completion and award stamp
    const completionCount = await this.missionRecordsService.countMemberMissionRecords(
      member.id,
      mission.id,
    );

    let memberReward = null;
    if (completionCount === 1) {
      // First completion - award a stamp
      memberReward = await this.memberRewardsService.giveReward(
        member.id,
        mission.id,
        missionRecord.id,
      );
    }

    // Mark code as used
    await this.redemptionCodesService.markAsUsed(redemptionCode.id, null);

    return {
      success: true,
      mission_record: missionRecord,
      member_reward: memberReward,
      is_first_completion: completionCount === 1,
    };
  }
}
