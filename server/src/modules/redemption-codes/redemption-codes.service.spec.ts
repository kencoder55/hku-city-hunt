import { Test, TestingModule } from '@nestjs/testing';
import { RedemptionCodesService } from './redemption-codes.service';

describe('RedemptionCodesService', () => {
  let service: RedemptionCodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedemptionCodesService],
    }).compile();

    service = module.get<RedemptionCodesService>(RedemptionCodesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
