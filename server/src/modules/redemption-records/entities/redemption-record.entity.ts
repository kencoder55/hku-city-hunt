import { Transform } from 'class-transformer';
import * as moment from 'moment';
import { Member } from 'src/modules/members/entities/member.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { RedemptionCode } from 'src/modules/redemption-codes/entities/redemption-code.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tbl_redemption_record' })
export class RedemptionRecord {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({
    type: 'bigint',
    nullable: false,
  })
  member_id: number;

  @Column({
    type: 'int',
    nullable: true,
  })
  product_id: number;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  redemption_code_id: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
  })
  type: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  remark: string;

  @ManyToOne(() => Member, { eager: false })
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @ManyToOne(() => Product, { eager: false })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => RedemptionCode, { eager: false })
  @JoinColumn({ name: 'redemption_code_id' })
  redemptionCode: RedemptionCode;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @Transform(({ value }) => (value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null))
  created_at: Date;
}
