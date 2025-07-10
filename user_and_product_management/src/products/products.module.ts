import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { DatabaseModule } from 'src/database/database.module';
import { BrandsModule } from 'src/brands/brands.module';

@Module({
    controllers: [ProductsController],
    providers: [ProductsService],
    imports: [DatabaseModule, BrandsModule],
})
export class ProductsModule {}
