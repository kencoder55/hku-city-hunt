import { Transform } from 'class-transformer';
import * as moment from 'moment';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tbl_user_session')
export class UserSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  token: string;

  @Column()
  @Transform(({ value }) => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null))
  expired_at: Date;

  @CreateDateColumn()
  @Transform(({ value }) => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null))
  created_at: Date;
}
