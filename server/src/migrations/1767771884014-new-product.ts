import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class NewProduct1767771884014 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tbl_product',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'type',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'name_en',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'name_zh',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'description_en',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'description_zh',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'cover_image',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'stock',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'required_rewards',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'redemption_date_en',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'redemption_date_zh',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'redemption_link',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'created_by',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'updated_by',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'deleted_by',
            type: 'int',
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

    // add product permission
    await queryRunner.query(
      `
      INSERT INTO tbl_permission 
      (module, action, role_id, created_by, updated_by) 
      VALUES 
      ('product', 'create', 1, 1, 1),
      ('product', 'update', 1, 1, 1),
      ('product', 'view', 1, 1, 1),
      ('product', 'delete', 1, 1, 1);
      `,
    );

    await queryRunner.query(
      `
      INSERT INTO tbl_permission_module (module, actions, created_by, updated_by)
      VALUES 
      ('product', '[\"view\", \"create\", \"update\", \"delete\"]', 1, 1);
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tbl_product');

    // remove product permission
    await queryRunner.query(
      `
      DELETE FROM tbl_permission 
      WHERE module = 'product';
      `,
    );

    await queryRunner.query(
      `
      DELETE FROM tbl_permission_module 
      WHERE module = 'product';
      `,
    );
  }
}
