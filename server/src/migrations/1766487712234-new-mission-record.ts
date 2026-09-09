import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class NewMissionRecord1766487712234 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // new table tbl_mission_record, mission_id (stored as mission_id in db for backwards compatibility), member_id, created_at
    await queryRunner.createTable(
      new Table({
        name: 'tbl_mission_record',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'slug',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'mission_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'member_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'result',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.query(
      `
      INSERT INTO tbl_permission 
      (module, action, role_id, created_by, updated_by) 
      VALUES 
      ('missionRecord', 'view', 1, 1, 1);
      `,
    );

    await queryRunner.query(
      `
      INSERT INTO tbl_permission_module (module, actions, created_by, updated_by)
      VALUES 
      ('missionRecord', '[\"view\"]', 1, 1);
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // drop table tbl_mission_record
    await queryRunner.dropTable('tbl_mission_record');
  }
}
