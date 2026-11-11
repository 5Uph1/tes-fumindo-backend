import { Check, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum AssetCategory {
  Consumable = 'Consumable',
  NonConsumable = 'Non-Consumable',
}

@Entity('asset')
@Check('stock_quantity >= 0')
@Check('length(trim(asset_name)) > 0')
export class Asset {
  @PrimaryGeneratedColumn('identity', {
    name: 'asset_id',
    generatedIdentity: 'ALWAYS',
  })
  asset_id!: number;

  @Column({ type: 'text' })
  asset_name!: string;

  @Column({ type: 'integer', default: 0 })
  stock_quantity!: number;

  @Column({
    type: 'enum',
    enum: AssetCategory,
    enumName: 'asset_category',
  })
  category!: AssetCategory;
}
