import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { DatabaseModule } from 'src/database/database.module';
import { CompaniesModule } from 'src/companies/companies.module';

@Module({
    controllers: [ProductsController],
    providers: [ProductsService],
    imports: [DatabaseModule, CompaniesModule],
})
export class ProductsModule {}
