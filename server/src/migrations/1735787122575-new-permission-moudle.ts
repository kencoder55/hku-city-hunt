import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class NewPermissionMoudle1735787122575 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const exists = await queryRunner.getTable('tbl_permission_module');

    if (exists) {
      return;
    }

    const table = new Table({
      name: 'tbl_permission_module',
      columns: [
        {
          name: 'id',
          type: 'int',
          isPrimary: true,
          isGenerated: true,
          unsigned: true,
          generationStrategy: 'increment',
        },
        {
          name: 'module',
          type: 'varchar',
          length: '50',
        },
        {
          name: 'actions',
          type: 'text',
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'CURRENT_TIMESTAMP',
          isNullable: false,
        },
        {
          name: 'created_by',
          type: 'int',
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
          name: 'deleted_at',
          type: 'timestamp',
          isNullable: true,
        },
      ],
    });

    await queryRunner.createTable(table);

    // add default data
    await queryRunner.query(
      `
      INSERT INTO tbl_permission_module (module, actions, created_by, updated_by)
      VALUES 
      ('landing', '[\"view\"]', 1, 1), 
      ('setting', '[\"view\"]', 1, 1), 
      ('user', '[\"view\", \"create\", \"update\", \"delete\"]', 1, 1), 
      ('role', '[\"view\", \"create\", \"update\", \"delete\"]', 1, 1), 
      ('permissionModule', '[\"view\", \"create\", \"update\", \"delete\"]', 1, 1),
      ('member', '[\"view\", \"create\", \"update\", \"delete\"]', 1, 1);
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tbl_permission_module');
  }
}
