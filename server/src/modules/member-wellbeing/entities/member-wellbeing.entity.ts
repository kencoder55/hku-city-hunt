import { Transform } from 'class-transformer';
import * as moment from 'moment';
import { Member } from 'src/modules/members/entities/member.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tbl_member_wellbeing' })
export class MemberWellbeing {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Index('idx_member_wellbeing_member_id')
  @Column({ type: 'int' })
  member_id: number;

  @Column({
    type: 'int',
  })
  wellbeing_score: number;

  @Column({ type: 'json', nullable: true })
  survey_answers: Record<string, number>;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Transform(({ value }) => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null))
  created_at: Date;
}
