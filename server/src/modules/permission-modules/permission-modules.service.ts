import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Not, Repository } from 'typeorm';
import { PermissionModule } from './entities/permission-module.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PermissionModulesService extends TypeOrmCrudService<PermissionModule> {
  constructor(
    @InjectRepository(PermissionModule)
    repo: Repository<PermissionModule>,
  ) {
    super(repo);
  }

  async checkExist({ id, module }: { id?: number, module: string}) {
    const queryBuilder = this.repo.createQueryBuilder();

    queryBuilder.where('(module = :module)', {
      module,
    });

    if (id) {
      queryBuilder.andWhere('id != :id', { id });
    }

    const existing = await queryBuilder.getOne();

    if (existing) {
      throw new BadRequestException('Permission module module already exists');
    }

    return false;
  }

  async updateDeletedBy(id: number, currentUser: User) {
    try {
      let result = await this.repo.update(id, {
        deleted_by: currentUser as User,
      });

      if (!result) {
        throw new BadRequestException('Failed to delete permission module');
      }

      return true;
    } catch (error) {
      throw new BadRequestException('Failed to delete permission module');
    }
  };

  async deleteOneByModule(id: number) {
    try{
      let result = await this.repo.softDelete(id);

      if(!result){
        throw new BadRequestException('Failed to delete permission module');
      }

      return true;
    }catch(error){
      throw new BadRequestException('Failed to delete permission module');
    }
  };
}
