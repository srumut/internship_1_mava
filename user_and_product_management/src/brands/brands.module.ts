import { Module } from '@nestjs/common';
import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    controllers: [BrandsController],
    providers: [BrandsService],
    imports: [DatabaseModule],
    exports: [BrandsService],
})
export class BrandsModule {}
