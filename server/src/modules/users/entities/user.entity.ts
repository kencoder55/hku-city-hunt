import { Transform } from 'class-transformer';
import * as moment from 'moment';
import { Role } from 'src/modules/roles/entities/role.entity';
import { jsonTransformer } from 'src/tools/CommonTools';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'tbl_user' })
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  password: string;

  @Column({
    type: 'text',
    transformer: jsonTransformer(),
  })
  roles: number[] | Role[];

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
