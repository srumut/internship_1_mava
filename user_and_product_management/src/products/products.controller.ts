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
    Req,
    HttpCode,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuardUser } from 'src/auth/auth.guard.user';
import { AuthGuardAdmin } from 'src/auth/auth.guard.admin';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
} from '@nestjs/swagger';

@Controller('products')
export class ProductsController {
    private logger: Logger;

    constructor(private readonly service: ProductsService) {
        this.logger = new Logger(ProductsController.name);
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Retrieve all products' })
    @ApiOkResponse({
        description: 'Successfully retrieved all the products',
    })
    @UseGuards(AuthGuardUser)
    @HttpCode(HttpStatus.OK)
    @Get()
    async findAll() {
        return await this.service.findAll();
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Retrieve product by id' })
    @ApiOkResponse({
        description: 'Successfully retrieved the product',
    })
    @ApiNotFoundResponse({
        description: 'Product with the given id does not exist',
    })
    @UseGuards(AuthGuardUser)
    @HttpCode(HttpStatus.OK)
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

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Admin only endpoin to create a product' })
    @ApiCreatedResponse({
        description: 'Successfully created the product',
    })
    @ApiBadRequestResponse({
        description: 'Properties thus must be unique are not unique',
    })
    @UseGuards(AuthGuardAdmin)
    @HttpCode(HttpStatus.CREATED)
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

    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Admin only endpoint to delete an existing product',
    })
    @ApiOkResponse({
        description: 'Product deleted successfully',
    })
    @ApiNotFoundResponse({
        description: 'Product with the given id does not exist',
    })
    @UseGuards(AuthGuardAdmin)
    @HttpCode(HttpStatus.OK)
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

    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Admin only endpoint to delete an existing product',
    })
    @ApiOkResponse({
        description: 'Product updated successfully',
    })
    @ApiNotFoundResponse({
        description: 'Product with the given id does not exist',
    })
    @UseGuards(AuthGuardAdmin)
    @HttpCode(HttpStatus.OK)
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
