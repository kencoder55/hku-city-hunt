import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import {
  comparePasswordWithBcrypt,
  covertingPasswordToBcrypt,
  covertingPasswordToSha1,
} from 'src/tools/CommonTools';
import { Equal, Not, Repository } from 'typeorm';
import { PermissionsService } from '../permissions/permissions.service';
import { RolesService } from '../roles/roles.service';
import { UserSessionsService } from '../sessions/user-sessions/user-sessions.service';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
  constructor(
    @InjectRepository(User)
    repo: Repository<User>,
    private jwtService: JwtService,
    private userSessionsService: UserSessionsService,
    private permissionsService: PermissionsService,
    private rolesService: RolesService,
  ) {
    super(repo);
  }

  async login(username: string, password: string) {
    const lowerCaseUsername = username.toLowerCase();

    const user = await this.repo.findOne({
      where: {
        username: lowerCaseUsername,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isPasswordMatching = comparePasswordWithBcrypt(password, user.password);

    if (!isPasswordMatching) {
      throw new BadRequestException('Invalid password');
    }

    const jwt = this.jwtService.sign({ id: user.id, username: user.username });

    // save jwt to session table
    this.userSessionsService.saveSession(user.id, jwt);

    return {
      id: user.id,
      username: user.username,
      jwt: jwt,
    };
  }

  async checkExist({ id, username }: { id?: number; username: string }) {
    const queryBuilder = this.repo.createQueryBuilder();

    queryBuilder.where('(username = :username)', {
      username,
    });

    if (id) {
      queryBuilder.andWhere('id != :id', { id });
    }

    const existing = await queryBuilder.getOne();

    if (existing) {
      throw new BadRequestException('User username already exists');
    }

    return false;
  }

  async getPermissionsByRole(roles: Array<number>) {
    let permissions = this.permissionsService.getPermissions(roles);

    return permissions;
  }

  async getRolesByIds(roles: number[]) {
    return this.rolesService.getRolesByIds(roles);
  }

  async mapRolesDetail(users: User[]) {
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const roles = user.roles as number[];
      user.roles = await this.getRolesByIds(roles);
    }

    return users;
  }
}
