import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class NewRedemptionRecord1770360210751 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tbl_redemption_record',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'member_id',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'product_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'redemption_code_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'type',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'remark',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
      }),
    );

    // add redemption-record permission
    await queryRunner.query(
      `
      INSERT INTO tbl_permission 
      (module, action, role_id, created_by, updated_by) 
      VALUES 
      ('redemptionRecord', 'create', 1, 1, 1),
      ('redemptionRecord', 'update', 1, 1, 1),
      ('redemptionRecord', 'view', 1, 1, 1),
      ('redemptionRecord', 'delete', 1, 1, 1);
      `,
    );

    await queryRunner.query(
      `
      INSERT INTO tbl_permission_module (module, actions, created_by, updated_by)
      VALUES 
      ('redemptionRecord', '[\"view\", \"create\", \"update\", \"delete\"]', 1, 1);
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tbl_redemption_record');

    // remove redemption-record permission
    await queryRunner.query(
      `
      DELETE FROM tbl_permission 
      WHERE module = 'redemption-record';
      `,
    );

    await queryRunner.query(
      `
      DELETE FROM tbl_permission_module 
      WHERE module = 'redemption-record';
      `,
    );
  }
}
