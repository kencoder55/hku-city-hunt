import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class NewMission1766487705066 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // new table tbl_mission, name, description, cover_image, start_time, end_time, category,location(text)
    await queryRunner.createTable(
      new Table({
        name: 'tbl_mission',
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
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'type',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'code',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'name_en',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'name_zh',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'description_en',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'description_zh',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'wellness_message_zh',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'wellness_message_en',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'address_zh',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'address_en',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'cover_image',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'start_time',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'end_time',
            type: 'timestamp',
            isNullable: false,
          },
          {
            name: 'category',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'location',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'parameter',
            type: 'text',
            isNullable: true,
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
      ('mission', 'create', 1, 1, 1),
      ('mission', 'update', 1, 1, 1),
      ('mission', 'view', 1, 1, 1),
      ('mission', 'delete', 1, 1, 1);
      `,
    );

    await queryRunner.query(
      `
      INSERT INTO tbl_permission_module (module, actions, created_by, updated_by)
      VALUES 
      ('mission', '[\"view\", \"create\", \"update\", \"delete\"]', 1, 1);
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tbl_mission');
  }
}
