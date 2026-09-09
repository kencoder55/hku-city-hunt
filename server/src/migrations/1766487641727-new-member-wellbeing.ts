import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class NewMemberWellbeing1766487641727 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // new table tbl_member_wellbeing
    await queryRunner.createTable(
      new Table({
        name: 'tbl_member_wellbeing',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'member_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'wellbeing_score',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'survey_answers',
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // drop table tbl_member_wellbeing
    await queryRunner.dropTable('tbl_member_wellbeing');
  }
}
