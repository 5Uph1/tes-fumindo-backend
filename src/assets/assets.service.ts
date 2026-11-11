import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Asset, AssetCategory } from './asset.entity.js';

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(Asset)
    private readonly assetRepository: Repository<Asset>,
  ) {}

  async findAll(search: string, page: number, limit: number) {
    const keyword = search.trim();

    const [data, total] = await this.assetRepository.findAndCount({
      where: keyword ? { asset_name: ILike(`%${keyword}%`) } : {},
      order: { asset_id: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const asset = await this.assetRepository.findOneBy({
      asset_id: id,
    });

    if (!asset) {
      throw new NotFoundException('Aset tidak ditemukan');
    }

    return asset;
  }

  async create(input: {
    asset_name: string;
    stock_quantity?: number;
    category: AssetCategory;
  }) {
    const asset = this.assetRepository.create(input);

    return this.assetRepository.save(asset);
  }

  async update(
    id: number,
    input: {
      asset_name?: string;
      stock_quantity?: number;
      category?: AssetCategory;
    },
  ) {
    const asset = await this.findOne(id);

    Object.assign(asset, input);

    return this.assetRepository.save(asset);
  }
}
