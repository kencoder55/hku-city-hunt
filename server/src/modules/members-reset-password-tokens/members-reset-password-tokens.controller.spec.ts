import { Test, TestingModule } from '@nestjs/testing';
import { MembersResetPasswordTokensController } from './members-reset-password-tokens.controller';
import { MembersResetPasswordTokensService } from './members-reset-password-tokens.service';

describe('MembersResetPasswordTokensController', () => {
  let controller: MembersResetPasswordTokensController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembersResetPasswordTokensController],
      providers: [MembersResetPasswordTokensService],
    }).compile();

    controller = module.get<MembersResetPasswordTokensController>(MembersResetPasswordTokensController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
