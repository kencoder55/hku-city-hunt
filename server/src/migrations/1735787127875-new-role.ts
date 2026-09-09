import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class NewRole1735787127875 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const exists = await queryRunner.getTable('tbl_role');

    if (exists) {
      return;
    }

    const table = new Table({
      name: 'tbl_role',
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
          name: 'name',
          type: 'varchar',
          length: '255',
        },
        {
          name: 'type',
          type: 'varchar',
          length: '255',
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
      `INSERT INTO tbl_role (name, type, created_by, updated_by) VALUES ('Super Admin', 'admin', 1, 1), ('Manager', 'user', 1, 1), ('Staff', 'user', 1, 1)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tbl_role');
  }
}
