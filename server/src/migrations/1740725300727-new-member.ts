import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class NewMember1740725300727 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: "tbl_member",
      columns: [
        {
          name: "id",
          type: "int",
          isPrimary: true,
          isGenerated: true,
          generationStrategy: "increment",
        },
        {
          name: "name",
          type: "varchar",
          length: "255",
        },
        {
          name: "email",
          type: "varchar",
          length: "100",
        },
        {
          name: "phone",
          type: "varchar",
          length: "50",
        },
        {
          name: "password",
          type: "varchar",
          length: "255",
        },
        {
          name: "created_by",
          type: "int",
        },
        {
          name: "updated_by",
          type: "int",
        },
        {
          name: "deleted_by",
          type: "int",
          isNullable: true,
        },
        {
          name: "created_at",
          type: "timestamp",
          default: "CURRENT_TIMESTAMP",
        },
        {
          name: "updated_at",
          type: "timestamp",
          default: "CURRENT_TIMESTAMP",
          onUpdate: "CURRENT_TIMESTAMP",
        },
        {
          name: "deleted_at",
          type: "timestamp",
          isNullable: true,
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
