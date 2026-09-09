import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class NewPermission1735787112136 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const exists = await queryRunner.getTable('tbl_permission');

    if (exists) {
      return;
    }

    const table = new Table({
      name: 'tbl_permission',
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
          name: 'action',
          type: 'varchar',
          length: '50',
        },
        {
          name: 'role_id',
          type: 'int',
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
      INSERT INTO tbl_permission 
      (module, action, role_id, created_by, updated_by) 
      VALUES 
      ('landing', 'view', 1, 1, 1), 
      ('setting', 'view', 1, 1, 1),  
      ('user', 'view', 1, 1, 1),
      ('user', 'create', 1, 1, 1),
      ('user', 'update', 1, 1, 1),
      ('user', 'delete', 1, 1, 1),
      ('role', 'view', 1, 1, 1),
      ('role', 'create', 1, 1, 1),
      ('role', 'update', 1, 1, 1),
      ('role', 'delete', 1, 1, 1),
      ('permissionModule', 'view', 1, 1, 1),
      ('permissionModule', 'create', 1, 1, 1),
      ('permissionModule', 'update', 1, 1, 1),
      ('permissionModule', 'delete', 1, 1, 1),
      ('member', 'view', 1, 1, 1),
      ('member', 'create', 1, 1, 1),
      ('member', 'update', 1, 1, 1),
      ('member', 'delete', 1, 1, 1);
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tbl_permission');
  }
}
