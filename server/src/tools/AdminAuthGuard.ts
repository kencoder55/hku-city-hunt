import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserSessionsService } from 'src/modules/sessions/user-sessions/user-sessions.service';

declare module 'express' {
  interface Request {
    user?: any;
  }
}

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly userSessionsService: UserSessionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');

    const session = await this.userSessionsService.verifySession(token);

    if (session) {
      try {
        const decoded = this.jwtService.verify(token);

        request.user = decoded;

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
