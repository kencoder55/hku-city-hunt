import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class AddMemberRewardMissionRecordIdIndex1772700000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      'tbl_member_reward',
      new TableIndex({ name: 'idx_member_reward_mission_record_id', columnNames: ['mission_record_id'] }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('tbl_member_reward', 'idx_member_reward_mission_record_id');
  }
}
