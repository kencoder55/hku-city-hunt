import { MigrationInterface, QueryRunner, TableIndex } from 'typeorm';

export class AddPerformanceIndex1772013883214 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // tbl_mission_record: index on member_id, mission_id, and composite
    await queryRunner.createIndex(
      'tbl_mission_record',
      new TableIndex({ name: 'idx_mission_record_member_id', columnNames: ['member_id'] }),
    );
    await queryRunner.createIndex(
      'tbl_mission_record',
      new TableIndex({ name: 'idx_mission_record_mission_id', columnNames: ['mission_id'] }),
    );
    await queryRunner.createIndex(
      'tbl_mission_record',
      new TableIndex({ name: 'idx_mission_record_member_mission', columnNames: ['member_id', 'mission_id'] }),
    );

    // tbl_member_wellbeing: index on member_id
    await queryRunner.createIndex(
      'tbl_member_wellbeing',
      new TableIndex({ name: 'idx_member_wellbeing_member_id', columnNames: ['member_id'] }),
    );

    // tbl_member_reward: index on member_id and mission_id
    await queryRunner.createIndex(
      'tbl_member_reward',
      new TableIndex({ name: 'idx_member_reward_member_id', columnNames: ['member_id'] }),
    );
    await queryRunner.createIndex(
      'tbl_member_reward',
      new TableIndex({ name: 'idx_member_reward_mission_id', columnNames: ['mission_id'] }),
    );

    // tbl_member_session: index on member_id and token (used on every authenticated request)
    await queryRunner.createIndex(
      'tbl_member_session',
      new TableIndex({ name: 'idx_member_session_member_id', columnNames: ['member_id'] }),
    );
    await queryRunner.createIndex(
      'tbl_member_session',
      new TableIndex({ name: 'idx_member_session_token', columnNames: ['token'] }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('tbl_mission_record', 'idx_mission_record_member_id');
    await queryRunner.dropIndex('tbl_mission_record', 'idx_mission_record_mission_id');
    await queryRunner.dropIndex('tbl_mission_record', 'idx_mission_record_member_mission');
    await queryRunner.dropIndex('tbl_member_wellbeing', 'idx_member_wellbeing_member_id');
    await queryRunner.dropIndex('tbl_member_reward', 'idx_member_reward_member_id');
    await queryRunner.dropIndex('tbl_member_reward', 'idx_member_reward_mission_id');
    await queryRunner.dropIndex('tbl_member_session', 'idx_member_session_member_id');
    await queryRunner.dropIndex('tbl_member_session', 'idx_member_session_token');
  }
}
