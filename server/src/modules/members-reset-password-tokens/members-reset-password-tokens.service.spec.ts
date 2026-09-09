import { Test, TestingModule } from '@nestjs/testing';
import { MembersResetPasswordTokensService } from './members-reset-password-tokens.service';

describe('MembersResetPasswordTokensService', () => {
  let service: MembersResetPasswordTokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MembersResetPasswordTokensService],
    }).compile();

    service = module.get<MembersResetPasswordTokensService>(MembersResetPasswordTokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
