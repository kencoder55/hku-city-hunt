import { Test, TestingModule } from '@nestjs/testing';
import { RedemptionRecordsController } from './redemption-records.controller';
import { RedemptionRecordsService } from './redemption-records.service';

describe('RedemptionRecordsController', () => {
  let controller: RedemptionRecordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RedemptionRecordsController],
      providers: [RedemptionRecordsService],
    }).compile();

    controller = module.get<RedemptionRecordsController>(RedemptionRecordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
