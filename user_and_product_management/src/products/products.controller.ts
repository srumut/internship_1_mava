import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
    constructor(private readonly service: ProductsService) {}

    @Get()
    async findAll() {
        return await this.service.findAll();
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        const product = await this.service.findById(id);
        if (!product) {
            throw new NotFoundException(
                `No product with the id ${id} was found`,
            );
        }
        return product;
    }

    @Post()
    async create(@Body() dto: CreateProductDto) {
        try {
            return await this.service.create(dto);
        } catch (error) {
            console.error(JSON.stringify(error));
            console.error(error);
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        try {
            return await this.service.delete(id);
        } catch (error) {
            switch (error.code) {
                case 'P2025':
                    throw new BadRequestException(
                        `No product with the id ${id} was found`,
                    );
            }
        }
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
        try {
            return await this.service.update(id, dto);
        } catch (error) {
            switch (error.code) {
                case 'P2025':
                    throw new BadRequestException(
                        `No product with the id ${id} was found`,
                    );
            }
        }
    }
}
