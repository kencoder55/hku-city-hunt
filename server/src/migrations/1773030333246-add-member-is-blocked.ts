import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMemberIsBlocked1773030333246 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE tbl_member
      ADD COLUMN is_blocked BOOLEAN NOT NULL DEFAULT FALSE AFTER is_sms_verified;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE tbl_member
      DROP COLUMN is_blocked;
    `);
  }
}
