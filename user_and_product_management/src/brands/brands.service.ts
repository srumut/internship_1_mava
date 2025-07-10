import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { v4 as uuid4 } from 'uuid';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
    constructor(private readonly db: DatabaseService) {}

    findAll() {
        return this.db.brand.findMany();
    }

    findById(id: string) {
        return this.db.brand.findUnique({ where: { id: id } });
    }

    create(dto: CreateBrandDto) {
        return this.db.brand.create({
            data: {
                id: uuid4(),
                name: dto.name,
                createdAt: new Date(),
            },
        });
    }

    delete(id: string) {
        return this.db.brand.delete({
            where: { id: id },
        });
    }

    update(id: string, dto: UpdateBrandDto) {
        return this.db.brand.update({ where: { id: id }, data: { ...dto } });
    }
}
