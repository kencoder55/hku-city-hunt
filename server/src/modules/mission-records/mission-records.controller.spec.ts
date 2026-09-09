import { Test, TestingModule } from '@nestjs/testing';
import { MissionRecordsController } from './mission-records.controller';
import { MissionRecordsService } from './mission-records.service';

describe('MissionRecordsController', () => {
  let controller: MissionRecordsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MissionRecordsController],
      providers: [MissionRecordsService],
    }).compile();

    controller = module.get<MissionRecordsController>(MissionRecordsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
