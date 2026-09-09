import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService extends TypeOrmCrudService<Permission> {
  errorMsg: string;
  currentUser: object;

  constructor(
    @InjectRepository(Permission)
    repo: Repository<Permission>,
  ) {
    super(repo);
  }

  async getPermissions(roles: Array<number>) {
    const permissions = await this.repo.find({
      where: {
        role_id: In([...roles]),
        deleted_at: IsNull(),
      },
    });

    return permissions;
  }

  async deleteOldRecord(roleId: number) {
    try {
      let result = await this.repo.softDelete({ role_id: roleId });

      if (!result) {
        throw new BadRequestException('Failed to delete old record');
      }

      return true;
    } catch (e) {
      this.errorMsg = e.message;
      return false;
    }
  }

  async insertNewRecord(roleId: number, permissions: object) {
    const insertData = [];

    for (const module in permissions) {
      permissions[module].forEach((action: string) => {
        insertData.push({
          module,
          action,
          role_id: roleId,
          created_by: this.currentUser,
          updated_by: this.currentUser,
        });
      });
    }

    try {
      if (insertData.length == 0) {
        return true;
      }

      let result = await this.repo.insert(insertData);

      if (!result) {
        throw new BadRequestException('Failed to insert new record');
      }

      return true;
    } catch (e) {
      this.errorMsg = e.message;
      return false;
    }
  }

  async savePermission(roleId: number, permissions: object, currentUser: object) {
    this.currentUser = currentUser;
    const deleteOldRecord = await this.deleteOldRecord(roleId);

    if (!deleteOldRecord) {
      throw new BadRequestException(this.errorMsg);
    }

    const insertNewRecord = await this.insertNewRecord(roleId, permissions);

    if (!insertNewRecord) {
      throw new BadRequestException(this.errorMsg);
    }

    return true;
  }

  async getPermissionDetails(id: number) {
    const permissions = await this.repo.find({
      where: {
        role_id: id,
        deleted_at: IsNull(),
      },
    });

    let permissionList = {};

    permissions.forEach((permission) => {
      const { module, action } = permission;

      if (!permissionList[module]) {
        permissionList[module] = [];
      }

      permissionList[module].push(action);
    });

    return permissionList;
  }
}
