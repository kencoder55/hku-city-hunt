import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { MemberSessionsService } from 'src/modules/sessions/member-sessions/member-sessions.service';

declare module 'express' {
  interface Request {
    member?: any;
    language?: string;
  }
}

@Injectable()
export class WebAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly memberSessionsService: MemberSessionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const language = request.headers['accept-language'];
    request.language = language;

    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) {
      return true;
    }

    const token = request.headers.authorization?.replace('Bearer ', '');

    const session = await this.memberSessionsService.verifySession(token);

    if (session) {
      try {
        const decoded = this.jwtService.verify(token);

        request.member = decoded;

        if (request.body) {
          request.body.created_by = decoded.id;
          request.body.updated_by = decoded.id;
        }

        return true;
      } catch (err) {
        console.log(err);
        throw new ForbiddenException('Invalid / Expired Token');
      }
    } else {
      return false;
    }
  }
}
