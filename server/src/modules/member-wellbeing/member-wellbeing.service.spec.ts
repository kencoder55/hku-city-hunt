import { Test, TestingModule } from '@nestjs/testing';
import { MemberWellbeingService } from './member-wellbeing.service';

describe('MemberWellbeingService', () => {
  let service: MemberWellbeingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemberWellbeingService],
    }).compile();

    service = module.get<MemberWellbeingService>(MemberWellbeingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
