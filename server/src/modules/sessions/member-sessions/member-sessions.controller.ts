import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MemberSessionsService } from './member-sessions.service';
import { CreateMemberSessionDto } from './dto/create-member-session.dto';
import { UpdateMemberSessionDto } from './dto/update-member-session.dto';

@Controller('member-sessions')
export class MemberSessionsController {
  constructor(private readonly memberSessionsService: MemberSessionsService) {}
}
