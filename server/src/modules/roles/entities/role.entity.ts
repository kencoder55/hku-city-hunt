import { Transform } from 'class-transformer';
import * as moment from 'moment';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity({ name: 'tbl_role' })
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  type: string;

  @ManyToOne(() => User, (user) => user, { eager: false })
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @ManyToOne(() => User, (user) => user, { eager: false })
  @JoinColumn({ name: 'updated_by' })
  updated_by: User;

  @ManyToOne(() => User, (user) => user, { eager: false })
  @JoinColumn({ name: 'deleted_by' })
  deleted_by: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Transform(({ value }) =>
    value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null,
  )
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  @Transform(({ value }) =>
    value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null,
  )
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  @Transform(({ value }) =>
    value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null,
  )
  deleted_at: Date;
}
