import { Test, TestingModule } from '@nestjs/testing';
import { PermissionModulesService } from './permission-modules.service';

describe('PermissionModulesService', () => {
  let service: PermissionModulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PermissionModulesService],
    }).compile();

    service = module.get<PermissionModulesService>(PermissionModulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
