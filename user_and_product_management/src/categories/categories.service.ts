import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { v4 as uuid4 } from 'uuid';
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
                id: uuid4(),
                ...dto,
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
