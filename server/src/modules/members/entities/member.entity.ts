import { Transform } from 'class-transformer';
import * as moment from 'moment';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'tbl_member' })
export class Member {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  name: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  avatar_id: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  password: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  age: string;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  gender: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  is_email_verified: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  is_sms_verified: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  is_blocked: boolean;

  @ManyToOne(() => User, user => user, { eager: false })
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @ManyToOne(() => User, user => user, { eager: false })
  @JoinColumn({ name: 'updated_by' })
  updated_by: User;

  @ManyToOne(() => User, user => user, { eager: false })
  @JoinColumn({ name: 'deleted_by' })
  deleted_by: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Transform(({ value }) => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null))
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  @Transform(({ value }) => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null))
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @Transform(({ value }) => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null))
  deleted_at: Date;
}
