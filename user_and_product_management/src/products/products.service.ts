import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateProductDto } from './dto/create-product.dto';
import { v4 as uuid4 } from 'uuid';
import { UpdateProductDto } from './dto/update-product.dto';
import { BrandsService } from 'src/brands/brands.service';

@Injectable()
export class ProductsService {
    constructor(
        private readonly db: DatabaseService,
        private readonly brandsService: BrandsService,
    ) {}

    findAll() {
        return this.db.product.findMany();
    }

    findById(id: string) {
        return this.db.product.findUnique({ where: { id: id } });
    }

    async create(dto: CreateProductDto) {
        const brand = await this.brandsService.findById(dto.brand_id);
        if (!brand) {
            throw new NotFoundException(
                `Brand with id ${dto.brand_id} was not found`,
            );
        }
        return this.db.product.create({
            data: {
                id: uuid4(),
                ...dto,
                createdAt: new Date(),
                brand_id: brand.id,
            },
        });
    }

    delete(id: string) {
        return this.db.product.delete({ where: { id: id } });
    }

    update(id: string, dto: UpdateProductDto) {
        return this.db.product.update({
            where: { id: id },
            data: { id: id, ...dto },
        });
    }
}
