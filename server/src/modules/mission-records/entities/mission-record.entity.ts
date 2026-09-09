import { Transform } from 'class-transformer';
import * as moment from 'moment';
import { Mission } from 'src/modules/missions/entities/mission.entity';
import { Member } from 'src/modules/members/entities/member.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { jsonTransformer } from 'src/tools/CommonTools';

@Entity({ name: 'tbl_mission_record' })
@Index('idx_mission_record_member_mission', ['member_id', 'mission_id'])
export class MissionRecord {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: false })
  slug: string;

  @Index('idx_mission_record_mission_id')
  @Column({ type: 'int' })
  mission_id: number;

  @Index('idx_mission_record_member_id')
  @Column({ type: 'int' })
  member_id: number;

  @ManyToOne(() => Mission, { eager: false })
  @JoinColumn({ name: 'mission_id' })
  mission: Mission;

  @ManyToOne(() => Member, { eager: false })
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @Column({ type: 'text', nullable: true, transformer: jsonTransformer() })
  result: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Transform(({ value }) => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null))
  created_at: Date;
}
