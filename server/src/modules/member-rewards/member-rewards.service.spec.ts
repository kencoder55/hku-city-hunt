import { Test, TestingModule } from '@nestjs/testing';
import { MemberRewardsService } from './member-rewards.service';

describe('MemberRewardsService', () => {
  let service: MemberRewardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemberRewardsService],
    }).compile();

    service = module.get<MemberRewardsService>(MemberRewardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
