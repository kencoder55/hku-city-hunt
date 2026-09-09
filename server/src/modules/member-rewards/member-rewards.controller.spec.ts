import { Test, TestingModule } from '@nestjs/testing';
import { MemberRewardsController } from './member-rewards.controller';
import { MemberRewardsService } from './member-rewards.service';

describe('MemberRewardsController', () => {
  let controller: MemberRewardsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberRewardsController],
      providers: [MemberRewardsService],
    }).compile();

    controller = module.get<MemberRewardsController>(MemberRewardsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
