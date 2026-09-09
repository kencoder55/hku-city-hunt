import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class NewRedemptionCode1770353575050 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tbl_redemption_code',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'type',
            type: 'varchar',
            length: '50',
            isNullable: false,
          },
          {
            name: 'code',
            type: 'varchar',
            length: '100',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'is_used',
            type: 'boolean',
            default: false,
            isNullable: false,
          },
          {
            name: 'created_by',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'updated_by',
            type: 'bigint',
            isNullable: false,
          },
          {
            name: 'deleted_by',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
          {
            name: 'deleted_at',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
    );

    // add redemption-code permission
    await queryRunner.query(
      `
      INSERT INTO tbl_permission 
      (module, action, role_id, created_by, updated_by) 
      VALUES 
      ('redemptionCode', 'create', 1, 1, 1),
      ('redemptionCode', 'update', 1, 1, 1),
      ('redemptionCode', 'view', 1, 1, 1),
      ('redemptionCode', 'delete', 1, 1, 1);
      `,
    );

    await queryRunner.query(
      `
      INSERT INTO tbl_permission_module (module, actions, created_by, updated_by)
      VALUES 
      ('redemptionCode', '[\"view\", \"create\", \"update\", \"delete\"]', 1, 1);
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tbl_redemption_code');

    // remove redemption-code permission
    await queryRunner.query(
      `
      DELETE FROM tbl_permission 
      WHERE module = 'redemption-code';
      `,
    );

    await queryRunner.query(
      `
      DELETE FROM tbl_permission_module 
      WHERE module = 'redemption-code';
      `,
    );
  }
}
