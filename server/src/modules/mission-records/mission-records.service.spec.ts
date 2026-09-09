import { Test, TestingModule } from '@nestjs/testing';
import { MissionRecordsService } from './mission-records.service';

describe('MissionRecordsService', () => {
  let service: MissionRecordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MissionRecordsService],
    }).compile();

    service = module.get<MissionRecordsService>(MissionRecordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
