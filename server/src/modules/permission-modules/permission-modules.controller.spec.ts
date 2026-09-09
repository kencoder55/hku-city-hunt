import { Test, TestingModule } from '@nestjs/testing';
import { PermissionModulesController } from './permission-modules.controller';
import { PermissionModulesService } from './permission-modules.service';

describe('PermissionModuleController', () => {
  let controller: PermissionModulesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionModulesController],
      providers: [PermissionModulesService],
    }).compile();

    controller = module.get<PermissionModulesController>(PermissionModulesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
