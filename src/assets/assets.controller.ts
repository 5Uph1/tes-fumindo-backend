import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { AssetsService } from './assets.service.js';
import { AssetCategory } from './asset.entity.js';

@Controller('api/assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  findAll(
    @Query('search') search: string = '',
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    if (typeof search !== 'string') {
      throw new BadRequestException('search harus berupa teks');
    }

    const pageNumber = this.parsePositiveInteger(page, 'page');
    const limitNumber = this.parsePositiveInteger(limit, 'limit');

    if (!Number.isSafeInteger((pageNumber - 1) * limitNumber)) {
      throw new BadRequestException('Kombinasi page dan limit terlalu besar');
    }

    return this.assetsService.findAll(search, pageNumber, limitNumber);
  }

  private parsePositiveInteger(value: string, field: string): number {
    if (typeof value !== 'string' || !/^[0-9]+$/.test(value)) {
      throw new BadRequestException(`${field} harus berupa integer positif`);
    }

    const number = Number(value);

    if (!Number.isSafeInteger(number) || number < 1) {
      throw new BadRequestException(`${field} harus berupa integer positif`);
    }

    return number;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const assetId = this.parsePositiveInteger(id, 'id');

    return this.assetsService.findOne(assetId);
  }

  @Post()
  create(@Body() body: unknown) {
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      throw new BadRequestException('Body harus berupa object JSON');
    }

    const input = body as Record<string, unknown>;

    if (
      typeof input.asset_name !== 'string' ||
      input.asset_name.trim().length === 0
    ) {
      throw new BadRequestException('asset_name wajib diisi');
    }

    if (
      input.category !== AssetCategory.Consumable &&
      input.category !== AssetCategory.NonConsumable
    ) {
      throw new BadRequestException(
        'category harus Consumable atau Non-Consumable',
      );
    }

    const stock = input.stock_quantity;

    if (
      stock !== undefined &&
      (typeof stock !== 'number' ||
        !Number.isInteger(stock) ||
        stock < 0 ||
        stock > 2147483647)
    ) {
      throw new BadRequestException('stock_quantity harus angka');
    }

    return this.assetsService.create({
      asset_name: input.asset_name.trim(),
      category: input.category,
      ...(stock !== undefined ? { stock_quantity: stock } : {}),
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: unknown) {
    const assetId = this.parsePositiveInteger(id, 'id');

    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      throw new BadRequestException('Body harus berupa object JSON');
    }

    const input = body as Record<string, unknown>;

    const changes: {
      asset_name?: string;
      stock_quantity?: number;
      category?: AssetCategory;
    } = {};

    if ('asset_name' in input) {
      if (
        typeof input.asset_name !== 'string' ||
        input.asset_name.trim().length === 0
      ) {
        throw new BadRequestException('asset_name tidak boleh kosong');
      }

      changes.asset_name = input.asset_name.trim();
    }

    if ('stock_quantity' in input) {
      const stock = input.stock_quantity;

      if (
        typeof stock !== 'number' ||
        !Number.isInteger(stock) ||
        stock < 0 ||
        stock > 2147483647
      ) {
        throw new BadRequestException(
          'stock_quantity harus integer antara 0 dan 2147483647',
        );
      }

      changes.stock_quantity = stock;
    }

    if ('category' in input) {
      if (
        input.category !== AssetCategory.Consumable &&
        input.category !== AssetCategory.NonConsumable
      ) {
        throw new BadRequestException(
          'category harus Consumable atau Non-Consumable',
        );
      }

      changes.category = input.category;
    }

    if (Object.keys(changes).length === 0) {
      throw new BadRequestException(
        'Kirim minimal satu field: asset_name, stock_quantity, atau category',
      );
    }

    return this.assetsService.update(assetId, changes);
  }
}
