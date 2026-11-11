import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Asset } from './asset.entity.js';

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
      order: { asset_id: 'DESC' },
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
}
