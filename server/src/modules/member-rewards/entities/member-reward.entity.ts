import { Transform } from 'class-transformer';
import * as moment from 'moment';
import { Member } from 'src/modules/members/entities/member.entity';
import { Mission } from 'src/modules/missions/entities/mission.entity';
import { MissionRecord } from 'src/modules/mission-records/entities/mission-record.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tbl_member_reward' })
export class MemberReward {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Index('idx_member_reward_member_id')
  @Column({ type: 'int' })
  member_id: number;

  @Index('idx_member_reward_mission_id')
  @Column({ type: 'int' })
  mission_id: number;

  @Index('idx_member_reward_mission_record_id')
  @Column({ type: 'int' })
  mission_record_id: number;

  @Column({ type: 'boolean', default: false })
  is_used: boolean;

  @ManyToOne(() => Member, { eager: false })
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @ManyToOne(() => Mission, { eager: false })
  @JoinColumn({ name: 'mission_id' })
  mission: Mission;

  @ManyToOne(() => MissionRecord, { eager: false })
  @JoinColumn({ name: 'mission_record_id' })
  missionRecord: MissionRecord;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Transform(({ value }) => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null))
  created_at: Date;
}
