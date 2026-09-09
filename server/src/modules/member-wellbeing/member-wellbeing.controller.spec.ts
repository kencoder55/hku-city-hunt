import { Test, TestingModule } from '@nestjs/testing';
import { MemberWellbeingController } from './member-wellbeing.controller';
import { MemberWellbeingService } from './member-wellbeing.service';

describe('MemberWellbeingController', () => {
  let controller: MemberWellbeingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberWellbeingController],
      providers: [MemberWellbeingService],
    }).compile();

    controller = module.get<MemberWellbeingController>(MemberWellbeingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
