import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class NewMemberReward1767769519872 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tbl_member_reward',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'member_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'mission_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'mission_record_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'is_used',
            type: 'boolean',
            default: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    await queryRunner.query(
      `
      INSERT INTO tbl_permission 
      (module, action, role_id, created_by, updated_by) 
      VALUES 
      ('memberReward', 'create', 1, 1, 1),
      ('memberReward', 'update', 1, 1, 1),
      ('memberReward', 'view', 1, 1, 1),
      ('memberReward', 'delete', 1, 1, 1);
      `,
    );

    await queryRunner.query(
      `
      INSERT INTO tbl_permission_module (module, actions, created_by, updated_by)
      VALUES 
      ('memberReward', '[\"view\", \"create\", \"update\", \"delete\"]', 1, 1);
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tbl_member_reward');
  }
}
