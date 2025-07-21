import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(private readonly db: DatabaseService) {}

    findAll() {
        return this.db.category.findMany();
    }

    findById(id: string) {
        return this.db.category.findUnique({ where: { id } });
    }

    create(dto: CreateCategoryDto) {
        return this.db.category.create({
            data: {
                ...dto,
                createdAt: new Date(),
            },
        });
    }

    delete(id: string) {
        return this.db.category.delete({ where: { id } });
    }

    update(id: string, dto: UpdateCategoryDto) {
        return this.db.category.update({ where: { id }, data: { ...dto } });
    }
}
