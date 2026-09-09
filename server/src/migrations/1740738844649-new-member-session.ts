import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class NewMemberSession1740738844649 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: 'tbl_member_session',
      columns: [
        {
          name: 'id',
          type: 'int',
          isPrimary: true,
          unsigned: true,
          isGenerated: true,
          generationStrategy: 'increment',
        },
        {
          name: 'member_id',
          type: 'int',
        },
        {
          name: 'token',
          type: 'varchar',
        },
        {
          name: 'expired_at',
          type: 'timestamp',
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'CURRENT_TIMESTAMP',
          isNullable: false,
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tbl_member_session', true);
  }
}
