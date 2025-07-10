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
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuardUser } from 'src/auth/auth.guard.user';
import { AuthGuardAdmin } from 'src/auth/auth.guard.admin';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('products')
export class ProductsController {
    constructor(private readonly service: ProductsService) {}

    @UseGuards(AuthGuardUser)
    @Get()
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully retrieved all the products',
    })
    async findAll() {
        return await this.service.findAll();
    }

    @UseGuards(AuthGuardUser)
    @Get(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully retrieved the product',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Product with the given id does not exist',
    })
    async findById(@Param('id') id: string) {
        const product = await this.service.findById(id);
        if (!product) {
            throw new NotFoundException(
                `No product with the id ${id} was found`,
            );
        }
        return product;
    }

    @UseGuards(AuthGuardAdmin)
    @Post()
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully created the product',
    })
    /* TODO(umut): when unique constraint added to product model
    @ApiResponse({
        status: HttpStatus.BadRequest,
        description: 'Properties thus must be unique are not unique',
    })
    */
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: `Internal server error`,
    })
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
                    console.error(error);
                    throw error;
            }
        }
    }

    @UseGuards(AuthGuardAdmin)
    @Delete(':id')
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Product deleted successfully',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Product with the given id does not exist',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: `Internal server error`,
    })
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
                    console.error(error);
                    throw error;
            }
        }
    }

    @UseGuards(AuthGuardAdmin)
    @Patch(':id')
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Product updated successfully',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Product with the given id does not exist',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: `Internal server error`,
    })
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
                    console.error(error);
                    throw error;
            }
        }
    }
}
