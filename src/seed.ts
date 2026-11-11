import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module.js';
import { Asset, AssetCategory } from './assets/asset.entity.js';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const dataSource = app.get(DataSource);
    const repository = dataSource.getRepository(Asset);

    if ((await repository.count()) > 0) {
      console.log('Seed dilewati: tabel asset sudah berisi data.');
      return;
    }

    const assets = [
      { asset_name: 'Kertas A4', category: AssetCategory.Consumable },
      {
        asset_name: 'Pulpen',
        stock_quantity: 50,
        category: AssetCategory.Consumable,
      },
      {
        asset_name: 'Pensil',
        stock_quantity: 30,
        category: AssetCategory.Consumable,
      },
      {
        asset_name: 'Penghapus',
        stock_quantity: 20,
        category: AssetCategory.Consumable,
      },
      {
        asset_name: 'Tinta Printer',
        stock_quantity: 8,
        category: AssetCategory.Consumable,
      },
      {
        asset_name: 'Map Dokumen',
        stock_quantity: 40,
        category: AssetCategory.Consumable,
      },
      {
        asset_name: 'Sticky Notes',
        stock_quantity: 15,
        category: AssetCategory.Consumable,
      },
      { asset_name: 'Baterai AA', category: AssetCategory.Consumable },
      {
        asset_name: 'Laptop',
        stock_quantity: 5,
        category: AssetCategory.NonConsumable,
      },
      {
        asset_name: 'Printer',
        stock_quantity: 2,
        category: AssetCategory.NonConsumable,
      },
      {
        asset_name: 'Monitor',
        stock_quantity: 6,
        category: AssetCategory.NonConsumable,
      },
      {
        asset_name: 'Keyboard',
        stock_quantity: 10,
        category: AssetCategory.NonConsumable,
      },
      {
        asset_name: 'Mouse',
        stock_quantity: 10,
        category: AssetCategory.NonConsumable,
      },
      {
        asset_name: 'Meja Kantor',
        stock_quantity: 12,
        category: AssetCategory.NonConsumable,
      },
      {
        asset_name: 'Kursi Kantor',
        stock_quantity: 12,
        category: AssetCategory.NonConsumable,
      },
    ];

    await repository.insert(assets);

    console.log(`Seed berhasil: ${assets.length} aset ditambahkan.`);
  } finally {
    await app.close();
  }
}

seed().catch((error: unknown) => {
  console.error('Seed gagal:', error);
  process.exitCode = 1;
});
