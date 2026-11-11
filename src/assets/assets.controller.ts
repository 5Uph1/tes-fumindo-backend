import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';

import { AssetsService } from './assets.service.js';

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
}
