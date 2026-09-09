import { Test, TestingModule } from '@nestjs/testing';
import { RedemptionCodesController } from './redemption-codes.controller';
import { RedemptionCodesService } from './redemption-codes.service';

describe('RedemptionCodesController', () => {
  let controller: RedemptionCodesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RedemptionCodesController],
      providers: [RedemptionCodesService],
    }).compile();

    controller = module.get<RedemptionCodesController>(RedemptionCodesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
