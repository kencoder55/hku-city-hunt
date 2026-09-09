import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AfterMember1766487151742 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // tbl_member, add avatar_id, gender, age, avatar_id after email
    // is_email_verified, is_sms_verified after password
    await queryRunner.query(`ALTER TABLE tbl_member 
        ADD COLUMN avatar_id INT NULL AFTER email,
        ADD COLUMN gender VARCHAR(10) NULL AFTER avatar_id,
        ADD COLUMN age varchar(10) NULL AFTER gender,
        ADD COLUMN is_email_verified BOOLEAN DEFAULT FALSE AFTER password,
        ADD COLUMN is_sms_verified BOOLEAN DEFAULT FALSE AFTER is_email_verified;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // revert tbl_member, drop avatar_id, gender, age
    await queryRunner.query(`ALTER TABLE tbl_member 
        DROP COLUMN avatar_id,
        DROP COLUMN gender,
        DROP COLUMN age,
        DROP COLUMN is_email_verified,
        DROP COLUMN is_sms_verified,
      `);
  }
}
