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
    UseGuards,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuardUser } from 'src/auth/auth.guard.user';
import { AuthGuardAdmin } from 'src/auth/auth.guard.admin';
import { ApiResponse } from '@nestjs/swagger';

@Controller('products')
export class ProductsController {
    private logger: Logger;

    constructor(private readonly service: ProductsService) {
        this.logger = new Logger(ProductsController.name);
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully retrieved all the products',
    })
    @UseGuards(AuthGuardUser)
    @Get()
    async findAll() {
        return await this.service.findAll();
    }

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully retrieved the product',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Product with the given id does not exist',
    })
    @UseGuards(AuthGuardUser)
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

    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully created the product',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Properties thus must be unique are not unique',
    })
    @UseGuards(AuthGuardAdmin)
    @Post()
    async create(@Body() dto: CreateProductDto) {
        try {
            return await this.service.create(dto);
        } catch (error) {
            if (error instanceof BadRequestException) throw error;
            switch (error.code) {
                case 'P2002':
                    throw new BadRequestException(
                        `Unique contraint failed for ${error.meta.target}`,
                    );
                default:
                    this.logger.error(error);
                    throw error;
            }
        }
    }

    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Product deleted successfully',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Product with the given id does not exist',
    })
    @UseGuards(AuthGuardAdmin)
    @Delete(':id')
    async delete(@Param('id') id: string) {
        try {
            return await this.service.delete(id);
        } catch (error) {
            switch (error.code) {
                case 'P2025':
                    throw new NotFoundException(
                        `No product with the id ${id} was found`,
                    );
                default:
                    this.logger.error(error);
                    throw error;
            }
        }
    }

    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Product updated successfully',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Product with the given id does not exist',
    })
    @UseGuards(AuthGuardAdmin)
    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
        try {
            return await this.service.update(id, dto);
        } catch (error) {
            switch (error.code) {
                case 'P2025':
                    throw new NotFoundException(
                        `No product with the id ${id} was found`,
                    );
                default:
                    this.logger.error(error);
                    throw error;
            }
        }
    }
}
