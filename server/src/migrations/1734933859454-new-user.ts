import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class NewUser1734933859454 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const exists = await queryRunner.getTable('tbl_user');

    if (exists) {
      return;
    }

    const table = new Table({
      name: 'tbl_user',
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
          name: 'username',
          type: 'varchar',
        },
        {
          name: 'email',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'password',
          type: 'varchar',
        },
        {
          name: 'roles',
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

    // add default data, password 123456 which is sha1
    await queryRunner.query(
      `INSERT INTO tbl_user (username, password, roles, created_at, created_by, updated_at, updated_by) VALUES ('admin', '7c4a8d09ca3762af61e59520943dc26494f8941b', '[1]', NOW(), 1, NOW(), 1)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const exists = await queryRunner.getTable('tbl_user');

    if (!exists) {
      return;
    }

    await queryRunner.dropTable('tbl_user');
  }
}
