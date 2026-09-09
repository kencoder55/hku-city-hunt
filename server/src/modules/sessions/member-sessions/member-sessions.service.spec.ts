import { Test, TestingModule } from '@nestjs/testing';
import { MemberSessionsService } from './member-sessions.service';

describe('MemberSessionsService', () => {
  let service: MemberSessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MemberSessionsService],
    }).compile();

    service = module.get<MemberSessionsService>(MemberSessionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
