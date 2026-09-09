import { Transform } from 'class-transformer';
import * as moment from 'moment';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tbl_member_reset_pwd_token')
export class MembersResetPasswordToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  member_id: number;

  @Column({ nullable: true })
  token: string;

  @Column({ type: 'timestamp', nullable: true })
  @Transform(({ value }) => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null))
  expires_at: Date;

  @Column({ default: false })
  is_used: boolean;

  @CreateDateColumn()
  @Transform(({ value }) => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null))
  created_at: Date;
}
