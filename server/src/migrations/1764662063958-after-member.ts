import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AfterMember1764662063958 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // allow null phone number, created_by, updated_by
    await queryRunner.query(`ALTER TABLE tbl_member 
      MODIFY COLUMN phone VARCHAR(100) NULL,
      MODIFY COLUMN created_by INT NULL,
      MODIFY COLUMN updated_by INT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // revert null phone number, created_by, updated_by
    await queryRunner.query(`ALTER TABLE tbl_member 
      MODIFY COLUMN phone VARCHAR(100) NOT NULL,
      MODIFY COLUMN created_by INT NOT NULL,
      MODIFY COLUMN updated_by INT NOT NULL
    `);
  }
}
