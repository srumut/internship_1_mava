import { Injectable } from '@nestjs/common';
import { Product } from 'generated/prisma';
import { DatabaseService } from 'src/database/database.service';
import { CreateProductDto } from './dto/create-product.dto';
import { v4 as uuid4 } from 'uuid';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(private readonly db: DatabaseService) {}

    findAll(): Promise<Product[]> {
        return this.db.product.findMany();
    }

    findById(id: string): Promise<Product | null> {
        return this.db.product.findUnique({ where: { id: id } });
    }

    create(
        dto: CreateProductDto,
    ): Promise<{ id: string; name: string; stock: number }> {
        return this.db.product.create({
            data: {
                id: uuid4(),
                ...dto,
            },
        });
    }

    delete(id: string): Promise<{ id: string; name: string; stock: number }> {
        return this.db.product.delete({ where: { id: id } });
    }

    update(
        id: string,
        dto: UpdateProductDto,
    ): Promise<{ id: string; name: string; stock: number }> {
        return this.db.product.update({
            where: { id: id },
            data: { id: id, ...dto },
        });
    }
}
