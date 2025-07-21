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
    Logger,
} from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { AuthGuardAdmin } from 'src/auth/auth.guard.admin';
import { UpdateBrandDto } from './dto/update-brand.dto';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
} from '@nestjs/swagger';
import { AuthGuardUser } from 'src/auth/auth.guard.user';
import { BrandDto } from './dto/brand.dto';

@Controller('brands')
export class BrandsController {
    private logger: Logger;
    constructor(private readonly service: BrandsService) {
        this.logger = new Logger(BrandsController.name);
    }

    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Successfully retrieved all the brands',
        type: [BrandDto],
    })
    @UseGuards(AuthGuardUser)
    @Get()
    async findAll() {
        return await this.service.findAll();
    }

    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Successfully retrieved the brand',
        type: BrandDto,
    })
    @ApiNotFoundResponse({
        description: 'Brand with the given id does not exist',
    })
    @UseGuards(AuthGuardAdmin)
    @Get(':id')
    async findById(@Param('id') id: string) {
        const brand = await this.service.findById(id);
        if (!brand)
            throw new NotFoundException(`Brand with id ${id} was not found`);
        return brand;
    }

    @ApiBearerAuth()
    @ApiCreatedResponse({
        description: 'Brand created successfully',
        type: BrandDto,
    })
    @UseGuards(AuthGuardAdmin)
    @Post()
    async create(@Body() dto: CreateBrandDto) {
        try {
            return await this.service.create(dto);
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Successfully deleted the brand',
        type: BrandDto,
    })
    @ApiNotFoundResponse({
        description: 'Brand with the given id does not exist',
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
                        `No brand with id ${id} was found`,
                    );
                default:
                    this.logger.error(error);
                    throw error;
            }
        }
    }

    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Successfully updated the brand',
        type: BrandDto,
    })
    @ApiNotFoundResponse({
        description: 'Brand with the given id does not exist',
    })
    @UseGuards(AuthGuardAdmin)
    @Patch(':id')
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
                    this.logger.error(error);
                    throw error;
            }
        }
    }
}
