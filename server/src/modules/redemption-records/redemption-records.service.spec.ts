import { Test, TestingModule } from '@nestjs/testing';
import { RedemptionRecordsService } from './redemption-records.service';

describe('RedemptionRecordsService', () => {
  let service: RedemptionRecordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedemptionRecordsService],
    }).compile();

    service = module.get<RedemptionRecordsService>(RedemptionRecordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
