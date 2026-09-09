import { Transform } from 'class-transformer';
import * as moment from 'moment';
import { jsonTransformer } from 'src/tools/CommonTools';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export interface MissionLocation {
  brand: string;
  code: string;
  name_zh: string;
  name_en: string;
  address_zh: string;
  address_en: string;
  link: string;
  max_distance: number;
  lat: number;
  lng: number;
  x: number;
  y: number;
}

@Entity({ name: 'tbl_mission' })
export class Mission {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  slug: string;

  @Column({
    type: 'varchar',
    length: '50',
    nullable: true,
  })
  code: string;

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
    type: 'varchar',
    nullable: true,
  })
  type: string;

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
    type: 'text',
    nullable: true,
  })
  wellness_message_zh: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  wellness_message_en: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  address_zh: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  address_en: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  cover_image: string;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  @Transform(({ value }) => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null))
  start_time: Date;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  @Transform(({ value }) => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null))
  end_time: Date;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  category: string;

  @Column({
    type: 'text',
    transformer: jsonTransformer(),
  })
  location: MissionLocation[];

  @Column({
    type: 'text',
    transformer: jsonTransformer(),
  })
  parameter: string;
}
