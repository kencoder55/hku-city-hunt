import { Transform } from 'class-transformer';
import * as moment from 'moment';
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tbl_member_session')
export class MemberSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('idx_member_session_member_id')
  @Column()
  member_id: number;

  @Index('idx_member_session_token')
  @Column()
  token: string;

  @Column()
  @Transform(({ value }) => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null))
  expired_at: Date;

  @CreateDateColumn()
  @Transform(({ value }) => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null))
  created_at: Date;
}
