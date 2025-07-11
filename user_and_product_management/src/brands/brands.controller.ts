import {
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
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { AuthGuardAdmin } from 'src/auth/auth.guard.admin';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('brands')
export class BrandsController {
    constructor(private readonly service: BrandsService) {}

    @UseGuards(AuthGuardAdmin)
    @Get()
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully retrieved all the brands',
    })
    async findAll() {
        return await this.service.findAll();
    }

    @UseGuards(AuthGuardAdmin)
    @Get(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully retrieved the brand',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Brand with the given id does not exist',
    })
    async findById(@Param('id') id: string) {
        const brand = await this.service.findById(id);
        if (!brand)
            throw new NotFoundException(`Brand with id ${id} was not found`);
        return brand;
    }

    @UseGuards(AuthGuardAdmin)
    @Post()
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Brand created successfully',
    })
    async create(@Body() dto: CreateBrandDto) {
        try {
            return await this.service.create(dto);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    @UseGuards(AuthGuardAdmin)
    @Delete(':id')
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully deleted the brand',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Brand with the given id does not exist',
    })
    async delete(@Param('id') id: string) {
        try {
            return await this.service.delete(id);
        } catch (error) {
            switch (error.code) {
                case 'P2025':
                    throw new NotFoundException(
                        `No brand with id ${id} was found`,
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
        status: HttpStatus.OK,
        description: 'Successfully updated the brand',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Brand with the given id does not exist',
    })
    @ApiResponse({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        description: `Internal server error`,
    })
    async update(@Param('id') id: string, @Body() dto: UpdateBrandDto) {
        try {
            return await this.service.update(id, dto);
        } catch (error) {
            switch (error.code) {
                case 'P2025':
                    throw new NotFoundException(
                        `No brand with id ${id} was found`,
                    );
                default:
                    console.error(error);
                    throw error;
            }
        }
    }
}
