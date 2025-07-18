import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    controllers: [CategoriesController],
    providers: [CategoriesService],
    imports: [DatabaseModule],
})
export class CategoriesModule {}
