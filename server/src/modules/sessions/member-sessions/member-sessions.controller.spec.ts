import { Test, TestingModule } from '@nestjs/testing';
import { MemberSessionsController } from './member-sessions.controller';
import { MemberSessionsService } from './member-sessions.service';

describe('MemberSessionsController', () => {
  let controller: MemberSessionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberSessionsController],
      providers: [MemberSessionsService],
    }).compile();

    controller = module.get<MemberSessionsController>(MemberSessionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
