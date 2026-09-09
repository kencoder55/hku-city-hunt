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

@Entity({ name: 'tbl_product' })
export class Product {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  type: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  name_zh: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  name_en: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description_zh: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description_en: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  cover_image: string;

  @Column({
    type: 'int',
    default: 0,
  })
  stock: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  required_rewards: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  redemption_date_zh: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  redemption_date_en: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  redemption_link: string;

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
