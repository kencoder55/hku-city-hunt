import { Controller } from '@nestjs/common';
import { UserSessionsService } from './user-sessions.service';

@Controller('admin/user-sessions')
export class UserSessionsController {
  constructor(private readonly service: UserSessionsService) {}
}
