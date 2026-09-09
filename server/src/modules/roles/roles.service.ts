import { TypeOrmCrudService } from '@dataui/crud-typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, In, Not, Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService extends TypeOrmCrudService<Role> {
  constructor(@InjectRepository(Role) repo: Repository<Role>) {
    super(repo);
  }

  async checkExist({ id, name }: { id?: number, name: string}) {
    const queryBuilder = this.repo.createQueryBuilder();

    queryBuilder.where('(name = :name)', {
      name,
    });

    if (id) {
      queryBuilder.andWhere('id != :id', { id });
    }

    const existing = await queryBuilder.getOne();

    if (existing) {
      throw new BadRequestException('Role name already exists');
    }

    return false;
  }

  async getRolesByIds(ids: number[]) {
    try {
      return await this.repo.find({
        select: ['id', 'name'],
        where: {
          id: In(ids),
        },
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
